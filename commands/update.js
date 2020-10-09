const Command = require("../base/Command.js"),
	child_process = require("child_process"),
	fs = require("fs");

class Update extends Command {
	constructor(client) {
		super(client, {
			name: "update",
			guildOnly: false,
			aliases: [],
			memberPermissions: [],
			botPermissions: [],
			ownerOnly: true,
			cooldown: 0
		});
	}

	async run(msg, args, data) {
		const l = msg.client.config.emojis.loading;
		await msg.client.user.setActivity("Updating . . .");

		// Download git repo
		let m = await msg.channel.send(`${l} | **Downloading git repo . . .**`);
		child_process.execSync("git clone https://github.com/cheesits456/0xDiscordBot.git", { cwd: process.env.PWD });

		// Replace old codebase with new stuff
		await m.edit(`${l} | **Porting config files . . .**`);
		child_process.execFileSync("./helpers/updater.sh", { cwd: process.env.PWD });

		// Port values from old config.json into new file
		delete require.cache[require.resolve("../config")];
		const config = {
			old: require("../config.bak"),
			new: require("../config")
		};
		for (const [key, value] of Object.entries(config.old)) config.new[key] = value;
		await fs.promises.writeFile("./config.json", JSON.stringify(config.new, null, "\t"), "utf8");
		await fs.promises.unlink("./config.bak.json");

		// Create .env file from current environment variables
		await fs.promises.writeFile("./.env", [
			"# Discord bot auth token",
			`DISCORD_TOKEN=${process.env.DISCORD_TOKEN || ""}`,
			"",
			"# Telegram bot auth token"
			`TELEGRAM_TOKEN=${process.env.TELEGRAM_TOKEN || ""}`,
			"",
			"# Twitter API tokens",
			`TWITTER_CONSUMER_KEY=${process.env.TWITTER_CONSUMER_KEY || ""}`,
			`TWITTER_CONSUMER_SECRET=${process.env.TWITTER_CONSUMER_SECRET || ""}`,
			`TWITTER_ACCESS_TOKEN=${process.env.TWITTER_ACCESS_TOKEN || ""}`,
			`TWITTER_ACCESS_TOKEN_SECRET=${process.env.TWITTER_ACCESS_TOKEN_SECRET || ""}`
		].join("\n"), "utf8");

		// Update node dependencies
		await m.edit(`${l} | **Updating dependencies . . .**`);
		child_process.execSync("npm i", { cwd: process.env.PWD });

		// Restart the bot
		msg.client.logger.warn(`Restarting ${msg.client.user.username} . . .`);
		await m.edit(`${l} | **Restarting . . .**`);
		await fs.promises.writeFile(
			"./restartMessage.json",
			JSON.stringify({ channel: m.channel.id, message: m.id, onComplete: "Updated" }),
			"utf8"
		);
		process.exit();
	}
}

module.exports = Update;
