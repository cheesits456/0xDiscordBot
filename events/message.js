const cmdCooldown = {};

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(msg) {
		if (msg.author.bot) return;

		const client = this.client,
			e = client.config.emojis;

		const data = {};
		data.config = client.config;

		if (msg.guild) data.guild = await client.findOrCreateGuild(msg.guild.id);

		// Check if the bot was mentionned
		if (msg.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) {
			if (msg.content.match(new RegExp(`^<@!?${client.user.id}>$`)))
				return msg.reply(`the prefix in this server is ${data.guild?.prefix || client.config.prefix}`);
		}

		// Gets the prefix
		let prefix = client.functions.getPrefix(msg, data);
		if (!prefix) return;

		let args = msg.content.slice(prefix.length).trim().split(/ +/g);
		let command = args.shift().toLowerCase();
		let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

		if (!cmd) return;

		if (cmd.conf.ownerOnly && !client.config.owners.includes(msg.author.id)) return;

		if (cmd.conf.guildOnly && !msg.guild)
			return msg.channel.send(`${e.error} | This command can only be used from a server!`).catch(() => {});

		if (msg.guild) {
			let neededPermission = [];
			for (const perm of cmd.conf.botPermissions) {
				if (!msg.channel.permissionsFor(msg.guild.me).has(perm)) neededPermission.push(perm);
			}
			if (neededPermission.length)
				return msg.channel.send(
					e.error +
					" | I need the following permissions to perform this command: `" +
					neededPermission.map(p => `\`${p}\``).join(", ") +
					"`"
				);

			neededPermission = [];
			for (const perm of cmd.conf.memberPermissions) {
				if (!msg.channel.permissionsFor(msg.member).has(perm)) neededPermission.push(perm);
			}
			if (neededPermission.length)
				return msg.channel.send(
					e.error +
					" | You do not have the necessary permissions to perform this command: `" +
					neededPermission.map(p => `\`${p}\``).join(", ") +
					"`"
				);
		}

		let uCooldown = cmdCooldown[msg.author.id];
		if (!uCooldown) {
			cmdCooldown[msg.author.id] = {};
			uCooldown = cmdCooldown[msg.author.id];
		}
		let time = uCooldown[cmd.conf.name] || 0;
		if (time && time > Date.now())
			return msg.channel
				.send(
					`${e.error} | You must wait **${Math.ceil(
						(time - Date.now()) / 1000
					)}** second(s) to be able to run this command again!`
				)
				.catch(() => {});
		cmdCooldown[msg.author.id][cmd.conf.name] = Date.now() + cmd.conf.cooldown;

		client.logger.cmd(
			`${client.functions.capitalize(cmd.conf.name)} Command Executed\n` +
				`\t${msg.author.id}\t${msg.author.tag}\n` +
				`\t${msg.channel.id}\t${msg.guild ? `#${msg.channel.name}` : "DM Channel"}` +
				`${msg.guild ? `\n\t${msg.guild.id}\t${msg.guild.name}` : ""}`
		);

		try {
			await cmd.run(msg, args, data);
		} catch (e) {
			client.logger.error(e);
			return msg.channel.send(`${client.config.emojis.error} | An unexpedted error has occurred`);
		}
	}
};
