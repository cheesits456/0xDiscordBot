const Discord = require("discord.js"),
	fetch = require("node-fetch");

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(fillData) {
		const client = this.client,
			icons = client.config.icons;

		let fill = await (await fetch(`https://api.0xtracker.com/fills/${fillData.id}`)).json();
		fill.retries = fillData.retries;

		if (!fill.value.USD && fill.retries < 5) {
			if (client.debug === "fills")
				client.logger.debug(
					`${fill.retries}\t${client.functions.intFix(fill.assets[0].amount, 4)} ${
						fill.assets[0].tokenSymbol
					}\t${client.functions.intFix(fill.assets[1].amount, 4)} ${fill.assets[1].tokenSymbol}`
				);
			fill.retries++;
			return client.setTimeout(() => client.emit("trackerFill", fill), 60000);
		}

		let ignore = true;
		for (const amount of Object.keys(require("../base/AmountEmojis"))) {
			if (!ignore) continue;
			if (!isNaN(Number(amount)) && fill.value.USD >= Number(amount)) ignore = false;
		}
		if (ignore) return;

		if (client.debug === "fills")
			client.logger.ready(
				`${fill.retries}\t${client.functions.intFix(fill.assets[0].amount, 4)} ${
					fill.assets[0].tokenSymbol
				}\t${client.functions.intFix(fill.assets[1].amount, 4)} ${fill.assets[1].tokenSymbol}`
			);

		const fromToken = { data: fill.assets[0] },
			toToken = { data: fill.assets[1] };

		fromToken.amount = client.functions.intFix(fromToken.data.amount, 4);
		fromToken.token = fromToken.data.tokenSymbol;
		fromToken.emoji = client.config.feedIcons
			? client.emojis.cache.get(icons[fromToken.token]) || client.emojis.cache.get(icons.default) || ""
			: "";

		toToken.amount = client.functions.intFix(toToken.data.amount, 4);
		toToken.token = toToken.data.tokenSymbol;
		toToken.emoji = client.config.feedIcons
			? client.emojis.cache.get(icons[toToken.token]) || client.emojis.cache.get(icons.default) || ""
			: "";

		let value = fill.value.USD ? client.functions.intFix(fill.value.USD, 2, true) : "";

		let emojis = "";
		if (fill.value.USD && client.config.feedIcons) {
			for (const [amount, emoji] of Object.entries(require("../base/AmountEmojis"))) {
				if (!isNaN(Number(amount))) {
					if (fill.value.USD >= Number(amount)) emojis = emoji;
				}
			}
		}

		let tweet = "";
		tweet += `${fromToken.amount} $${fromToken.token}`;
		tweet += " ⇋ ";
		tweet += `${toToken.amount} $${toToken.token} `;
		if (value) tweet += `[$${value} USD] `;
		if (emojis) tweet += `${emojis}`;
		tweet += `\n\nTraded on ${fill.relayer?.name || "an unknown platform"}`;
		tweet += `\nView trade 👉 0xtracker.com/fills/${fill.id}\n\n`;
		tweet += new Date(fill.date).toUTCString();

		let tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;

		let message = "";
		if (fromToken.emoji) message += `${fromToken.emoji} `;
		message += `**${fromToken.amount}** \`${fromToken.token}\``;
		message += "  **⇋**   ";
		if (toToken.emoji) message += `${toToken.emoji} `;
		message += `**${toToken.amount}** \`${toToken.token}\``;
		if (value) message += `   [$${value} USD]`;
		if (emojis) message += ` ${emojis}`;
		message += `\nTraded on ${fill.relayer?.name || "an unknown platform"}`;
		message += "  **|**  ";
		message += `[View on 0x Tracker](<https://0xtracker.com/fills/${fill.id}>)`;
		message += "  **|**  ";
		if (icons?.twitter) message += `${client.emojis.cache.get(icons.twitter)}`;
		message += `[Tweet this trade](<${tweetLink}>)`;

		for (const [, guild] of client.guilds.cache) {
			let guildData = await client.findOrCreateGuild(guild.id);
			if (!guildData.stats.trades) continue;
			const channel = guild.channels.cache.get(guildData.stats.trades);
			if (!channel) {
				delete guildData.stats.trades;
				await guildData.save();
				continue;
			}

			let embed = new Discord.MessageEmbed().setTitle(new Date(fill.date).toUTCString()).setDescription(message);

			await channel.send(embed);
		}

		if (client.twitter && Number(value.replace(/,/g, "")) >= 250000)
			client.twitter.post("statuses/update", { status: tweet });
	}
};
