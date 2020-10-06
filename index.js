// Load environment variables from .env
require("dotenv-defaults").config();

// Package to patch the way discord.js handles role mentions when
// "client.options.disableMentions"  is set to "everyone"
// See https://github.com/HaileyBot/sanitize-role-mentions for more info
require("@haileybot/sanitize-role-mentions")();

const fs = require("fs");

// Create "guilds" directory if it doesn't already exist
if (!fs.existsSync("./guilds")) fs.mkdirSync("./guilds");

// Load Client class (extends Discord.Client)
const Client = require("./base/Client");
const client = new Client({ disableMentions: "everyone" });

// Load Commands
const cmdFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for (const cmdFile of cmdFiles) client.loadCommand("./commands/", cmdFile);

// Load events
const eventFiles = fs.readdirSync("./events/").filter(file => file.endsWith(".js"));
for (const eventFile of eventFiles) {
	const eventName = eventFile.split(".")[0];
	const event = new (require(`./events/${eventFile}`))(client);
	client.on(eventName, (...args) => event.run(...args));
	delete require.cache[require.resolve(`./events/${eventFile}`)];
}

// Log errors, warnings, info, etc
client
	.on("error", e => client.logger.error(e))
	.on("shardError", (e, id) => {
		client.logger.error(`Error on shard ${id}:`);
		client.logger.error(e);
	})
	.on("debug", info => {
		// Check if "info" is reporting a shard initializing a load sequence
		const loading = info.match(/\[WS => Shard (\d+)] \[CONNECT]/);
		if (loading) return client.logger.log(`Loading shard ${loading[1]} . . .`);

		// Check if "info" is reporting how many sessions the client has left
		// - Discord clients are limited to a max of 1000 logins per day
		// - See https://discord.com/developers/docs/topics/gateway#identifying
		//   for more info (look for the yellow box)
		const sessions = info.match(/Remaining: (\d+)$/);
		if (sessions) return client.logger.debug(`Session ${1000 - parseInt(sessions[1], 10)} of 1000`);
	})
	.on("shardReady", id => client.logger.ready(`Shard ${id} connected!`))
	.on("shardResume", id => client.logger.ready(`Shard ${id} connected!`));

// Log in to Discord
client.login(client.config.token).catch(e => {
	client.logger.error(e.message);
	process.exit();
});

process.on("unhandledRejection", err => client.logger.error(err));
