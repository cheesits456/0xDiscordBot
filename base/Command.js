const path = require("path");

module.exports = class Command {
	constructor(
		client,
		{
			name = null,
			guildOnly = false,
			aliases = new Array(),
			botPermissions = new Array(),
			memberPermissions = new Array(),
			ownerOnly = false,
			cooldown = 3000
		}
	) {
		this.client = client;
		this.conf = { name, guildOnly, aliases, memberPermissions, botPermissions, ownerOnly, cooldown };
	}
};
