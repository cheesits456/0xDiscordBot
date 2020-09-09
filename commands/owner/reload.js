const Command = require("../../base/Command.js");

class Reload extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			description: "reload a command",
			usage: "{prefix}reload <command>",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [],
			memberPermissions: [],
			botPermissions: [],
			nsfw: false,
			ownerOnly: true,
			cooldown: 3000
		});
	}

	async run(msg, args, data) {
		const e = msg.client.config.emojis;

		if (!args[0]) return msg.channel.send(`${e.error} | Must include a command to reload`);

		let cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
		if (!cmd) return msg.channel.send(`${e.error} | Command \`${args[0]}\` does not exist`);

		await this.client.unloadCommand(cmd.conf.location, cmd.help.name);
		await this.client.loadCommand(cmd.conf.location, cmd.help.name);

		msg.channel.send(`${e.success} | Command \`${args[0]}\` has been reloaded`);
	}
}

module.exports = Reload;
