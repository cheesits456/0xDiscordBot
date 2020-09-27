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
		let m = await msg.channel.send(`${l} | **Downloading git repo . . .**`);

		child_process.execFileSync("./helpers/updater.sh", { cwd: process.env.PWD });

		await m.edit(`${l} | **Porting config files . . .**`);

		delete require.cache[require.resolve("../config")];

		const config = {
			old: require("../config.bak"),
			new: require("../config")
		};

		for (const [key, value] of Object.entries(config.old)) config.new[key] = value;

		await fs.promises.writeFile("./config.json", JSON.stringify(config.new, null, "\t"), "utf8");
		await fs.promises.unlink("./config.bak.json");

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
