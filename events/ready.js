const fetch = require("node-fetch"),
	fs = require("fs");

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run() {
		const client = this.client,
			config = client.config;

		// Fetch initial tracker fills
		client._fills = (await (await fetch("https://api.0xtracker.com/fills")).json()).total;

		// Update client status every 15 seconds
		let i = 0;
		client.setInterval(async () => {
			let toDisplay = {
				text: config.statuses[i].name,
				type: config.statuses[i].type
			};

			if (toDisplay.text.includes("{traders}"))
				toDisplay.text = toDisplay.text.replace(
					"{traders}",
					(await (await fetch("https://api.0xtracker.com/stats/trader?period=day")).json()).traderCount
				);

			if (toDisplay.text.includes("{trades}"))
				toDisplay.text = toDisplay.text.replace(
					"{trades}",
					`${
						Math.round(
							(await (await fetch("https://api.0xtracker.com/stats/network?period=day")).json())
								.tradeCount / 10
						) / 100
					}k`
				);

			client.user.setActivity(toDisplay.text, { type: toDisplay.type });

			i++;
			if (i >= config.statuses.length) i = 0;
		}, 1000 * 15);

		// Update stats channels every 5 minutes
		client.setInterval(() => {
			for (const [, guild] of client.guilds.cache) client.updateStats(guild);
		}, 1000 * 60 * 5);

		// trackerFill event-emitter API
		client.setInterval(async () => {
			const fills = await (await fetch("https://api.0xtracker.com/fills")).json();
			if (fills.total === client._fills) return;
			for (let i = fills.total - client._fills - 1; i >= 0; i--) {
				client.setTimeout(() => client.emit("trackerFill", fills.fills[i]), 60000);
			}
			client._fills = fills.total;
		}, 1000 * 60);

		// Logs some information
		client.logger.ready(
			`Connected to ${client.guilds.cache.size.toLocaleString()} servers with ${client.guilds.cache
				.reduce((p, g) => p + g.memberCount, 0)
				.toLocaleString()} members`
		);

		if (fs.existsSync("./restartMessage.json")) {
			let restartMessage = require("../restartMessage");
			const rm = require("fs").unlinkSync;
			let m = await client.channels.cache.get(restartMessage.channel)?.messages.fetch(restartMessage.message);
			if (m) {
				m.edit(
					`${client.config.emojis.success} | Restarted in \`${client.functions.msFix(
						Date.now() - m.createdTimestamp
					)}\``
				);
				client.logger.ready(
					`All shards restarted in ${client.functions.msFix(Date.now() - m.createdTimestamp)}`
				);
			}
			rm("./restartMessage.json");
		}

		client.logger.log(
			`Use this link to invite the bot to a server:\nhttps://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1897139216&scope=bot`
		);
	}
};
