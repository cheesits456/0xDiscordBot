const Command = require("../base/Command.js"),
	Discord = require("discord.js");

class Prefix extends Command {
	constructor(client) {
		super(client, {
			name: "prefix",
			guildOnly: true,
			aliases: [],
			memberPermissions: ["MANAGE_GUILD"],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run(msg, args, data) {
		const e = msg.client.config.emojis;

		let prefix = args[0];
		if (!prefix) return msg.channel.send(`${e.error} | Please enter a new prefix to be used!`);
		if (prefix.length > 5) return msg.channel.send(`${e.error} | The prefix must be 5 characters or less!`);

		data.guild.prefix = prefix;
		await data.guild.save();

		// Sucess
		return msg.channel.send(`${e.success} | The prefix has been changed to \`${Discord.escapeMarkdown(prefix)}\`!`);
	}
}

module.exports = Prefix;
