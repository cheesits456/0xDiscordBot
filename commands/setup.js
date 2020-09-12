const Command = require("../base/Command.js"),
	Discord = require("discord.js");

class Setup extends Command {
	constructor(client) {
		super(client, {
			name: "setup",
			description:
				"create a category of viewable but non-joinable voice channels who's names update as things on the server change",
			usage: "{prefix}setup",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			global: false,
			aliases: [],
			memberPermissions: ["MANAGE_GUILD"],
			botPermissions: ["SEND_MESSAGES", "MANAGE_CHANNELS", "MANAGE_ROLES"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run(msg, args, data) {
		const m = await msg.channel.send(`${msg.client.config.emojis.loading} | **Creating Stat Channels . . .**`),
			client = msg.client,
			guild = msg.guild,
			permissionOverwrites = [
				{
					id: msg.guild.roles.everyone,
					allow: ["VIEW_CHANNEL"],
					deny: ["CONNECT", "SEND_MESSAGES"]
				},
				{
					id: msg.client.user.id,
					allow: [
						"CONNECT",
						"MANAGE_CHANNELS",
						"MANAGE_ROLES",
						"MANAGE_WEBHOOKS",
						"MOVE_MEMBERS",
						"SEND_MESSAGES"
					]
				}
			],
			names = {
				staked: "ZRX staked",
				ends: "Epoch ends in",
				rewards: "Current rewards"
			};

		if (!guild.channels.cache.has(data.guild.stats.staking.category)) {
			let c = await guild.channels.create("Staking Stats", { type: "category", permissionOverwrites });
			await c.setPosition(0);
			data.guild.stats.staking.category = c.id;
		}

		for (const stat of ["staked", "ends", "rewards"]) {
			if (!guild.channels.cache.has(data.guild.stats.staking[stat])) {
				let c = await guild.channels.create(`${names[stat]}: Loading...`, {
					type: "voice",
					permissionOverwrites
				});
				await c.setParent(data.guild.stats.staking.category);
				data.guild.stats.staking[stat] = c.id;
			}
		}

		if (!guild.channels.cache.has(data.guild.stats.volume.category)) {
			let c = await guild.channels.create("0x Volume [24h | All-Time]", {
				type: "category",
				permissionOverwrites
			});
			await c.setPosition(1);
			data.guild.stats.volume.category = c.id;
		}

		if (!guild.channels.cache.has(data.guild.stats.volume.totals)) {
			let c = await guild.channels.create(`Totals: Loading...`, {
				type: "voice",
				permissionOverwrites
			});
			await c.setParent(data.guild.stats.volume.category);
			data.guild.stats.volume.totals = c.id;
		}

		if (!guild.channels.cache.has(data.guild.stats.trades)) {
			let c = await guild.channels.create("trades", {
				type: "text",
				permissionOverwrites
			});
			data.guild.stats.trades = c.id;
		}

		await data.guild.save();
		await client.updateStats(msg.guild, m);
		m.edit(`${client.config.emojis.success} | **Successfully created Stat Channels!**`);
	}
}

module.exports = Setup;
