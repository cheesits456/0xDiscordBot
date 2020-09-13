const Command = require("../base/Command.js"),
	Discord = require("discord.js");

class Ping extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			guildOnly: false,
			aliases: ["pong"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run(msg) {
		const m = await msg.channel.send(`${msg.client.config.emojis.loading} **Pinging. . .**`);
		let i = 0,
			s = Date.now();
		while (Date.now() - s <= 1) i++;

		let embed = new Discord.MessageEmbed()
			.setTitle("🏓 **PONG!**")
			.addField("Response ​ ​ ​ ​ ​ ​ ​ ​ ​", `\`\`\`ini\n[ ${m.createdTimestamp - msg.createdTimestamp}ms ]\`\`\``, true)
			.addField("Websocket ​ ​ ​ ​ ​ ​ ​ ​", `\`\`\`ini\n [ ${Math.floor(msg.client.ws.ping)}ms ]\`\`\``, true);

		m.edit("", embed);
	}
}

module.exports = Ping;
