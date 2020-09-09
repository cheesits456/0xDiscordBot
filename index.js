require("@haileybot/sanitize-role-mentions")();

const fs = require("fs"),
	readdir = fs.readdirSync;

if (!fs.existsSync("./guilds")) fs.mkdirSync("./guilds");

// Load HaileyBot class (extends Discord.Client)
const Client = require("./base/Client");
const client = new Client({ disableMentions: "everyone" });

// Load Commands
const categories = readdir("./commands/");
for (const category of categories) {
	const commands = readdir(`./commands/${category}/`).filter(file => file.endsWith(".js"));
	for (const cmd of commands) client.loadCommand(`./commands/${category}`, cmd);
}

// Load events
const events = readdir("./events/").filter(file => file.endsWith(".js"));
for (const eventFile of events) {
	const eventName = eventFile.split(".")[0];
	const event = new (require(`./events/${eventFile}`))(client);
	client.on(eventName, (...args) => event.run(...args));
	delete require.cache[require.resolve(`./events/${eventFile}`)];
}

// Log Errors and info
client
	.on("error", e => client.logger.error(e))
	.on("shardError", (e, id) => {
		client.logger.error(`Error on shard ${id}:`);
		client.logger.error(e);
	})
	.on("debug", info => {
		const loading = info.match(/\[WS => Shard (\d+)] \[CONNECT]/),
			sessions = info.match(/Remaining: (\d+)$/);
		if (loading) return client.logger.log(`Loading shard ${loading[1]} . . .`);
		if (sessions) return client.logger.debug(`Session ${1000 - parseInt(sessions[1], 10)} of 1000`);
		if (info.match(/Sending a heartbeat|Heartbeat acknowledged/)) return;
		if (info.startsWith("429 hit on route")) return;
	})
	.on("shardReady", id => client.logger.ready(`Shard ${id} connected!`))
	.on("shardResume", id => client.logger.ready(`Shard ${id} connected!`));

// Log in to Discord
client.login(client.config.token.discord).catch(e => {
	client.logger.error(e.message);
	process.exit();
});

process.on("unhandledRejection", err => client.logger.error(err));
