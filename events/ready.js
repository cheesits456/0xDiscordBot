const fetch = require("node-fetch"),
	fs = require("fs");

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run() {
		let client = this.client;

		// Fetch initial tracker fills
		client._fills = (await (await fetch("https://api.0xtracker.com/fills")).json()).total;

		// Update client status every 15 seconds
		let i = 0;
		client.setInterval(async () => {
			let toDisplay = {
				text: client.config.status[i].name,
				type: client.config.status[i].type
			};

			if (toDisplay.text.includes("{servers}"))
				toDisplay.text = toDisplay.text.replace("{servers}", client.guilds.cache.size.toLocaleString());

			if (toDisplay.text.includes("{users}"))
				toDisplay.text = toDisplay.text.replace(
					"{users}",
					client.guilds.cache.reduce((p, g) => p + g.memberCount, 0).toLocaleString()
				);

			if (toDisplay.text.includes("{traders}"))
				toDisplay.text = toDisplay.text.replace(
					"{traders}",
					(await (await fetch("https://api.0xtracker.com/stats/trader?period=day")).json()).traderCount
				);

			if (toDisplay.text.includes("{trades}"))
				toDisplay.text = toDisplay.text.replace(
					"{trades}",
					`${Math.round((await (await fetch("https://api.0xtracker.com/stats/network?period=day")).json()).tradeCount / 10) / 100}k`
				);

			client.user.setActivity(toDisplay.text, { type: toDisplay.type });
			if (client.config.status[i + 1]) i++;
			else i = 0;
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
				await client.emit("trackerFill", fills.fills[i]);
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
	}
};
