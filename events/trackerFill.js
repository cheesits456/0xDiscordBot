const Discord = require("discord.js");

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(fill) {
		const client = this.client,
			icons = client.config.icons;

		for (const [, guild] of client.guilds.cache) {
			let guildData = await client.findOrCreateGuild(guild.id);
			if (!guildData.stats.trades) continue;
			const channel = guild.channels.cache.get(guildData.stats.trades);
			if (!channel) {
				delete guildData.stats.trades;
				await guildData.save();
				continue;
			}

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
			if (client.config.feedIcons) {
				let v = fill.value.USD ? String(Math.floor(fill.value.USD)) : "";
				for (let i = 0; i < v.length - 4; i++) emojis += "🔥";
			}

			let tweetLink = "";
			if (emojis) tweetLink += `${emojis} `;
			tweetLink += `${fromToken.amount} $${fromToken.token}`;
			tweetLink += " ⇋ ";
			tweetLink += `${toToken.amount} $${toToken.token} `;
			if (value) tweetLink += `[$${value} USD] `;
			tweetLink += `traded on ${fill.relayer?.name || "an unknown platform"}`;
			tweetLink += `\n\nDate: ${new Date(fill.date).toUTCString()}`;
			tweetLink += `\nView: 0xtracker.com/fills/${fill.id}`;
			tweetLink += "\n\n#0xDiscordBot";
			tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetLink)}`;

			const hook =
				(await channel.fetchWebhooks()).first() ||
				(await channel.createWebhook(client.user.username, {
					avatar: client.user.displayAvatarURL({ format: "png" })
				}));

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
			if (icons.twitter) message += `${client.emojis.cache.get(icons.twitter)}`;
			message += `[Tweet this trade](<${tweetLink}>)`;

			await hook.send(message, {
				username: new Date(fill.date).toUTCString(),
				avatarURL: client.user.displayAvatarURL({ format: "png" })
			});
		}
	}
};
