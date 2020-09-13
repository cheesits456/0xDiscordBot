const Command = require("../base/Command.js"),
	write = require("fs").writeFileSync,
	Discord = require("discord.js");

class Restart extends Command {
	constructor(client) {
		super(client, {
			name: "restart",
			guildOnly: false,
			aliases: [],
			memberPermissions: [],
			botPermissions: [],
			ownerOnly: true,
			cooldown: 3000
		});
	}

	async run(msg, args, data) {
		const l = msg.client.config.emojis.loading;

		msg.client.logger.warn(`Restarting ${msg.client.user.username} . . .`);

		let m = await msg.channel.send(`${l} | **Shutting Down . . .**`);
		await msg.client.user.setActivity("Restarting . . .");
		await m.edit(`${l} | **Restarting . . .**`);
		write("./restartMessage.json", JSON.stringify({ channel: m.channel.id, message: m.id }), "utf8");
		process.exit();
	}
}

module.exports = Restart;
