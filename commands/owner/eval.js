const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Eval extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			description: "execute a node.js function",
			usage: "{prefix}eval <function>",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: ["exec"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES"],
			nsfw: false,
			ownerOnly: true,
			cooldown: 3000
		});
	}

	async run(msg, args, data) {
		const e = msg.client.config.emojis;

		if (!args[0]) return msg.channel.send(`${e.error} | Missing required command arguments!`);

		const fetch = require("node-fetch"),
			fs = require("fs"),
			http = require("http"),
			https = require("https");

		const client = msg.client,
			config = client.config;

		const options = {
			code: "js",
			split: true
		};

		const match = args[0].match(/--(depth)=(\d+)/);
		const depth = match && match[1] === "depth" ? parseInt(match[2]) : 0;

		const content = msg.content
			.split(" ")
			.slice(match || !msg.content.startsWith(data.guild?.prefix || msg.client.config.prefix) ? 2 : 1)
			.join(" ");
		const result = new Promise((resolve, reject) => resolve(eval(content)));

		return result
			.then(output => {
				if (typeof output !== "string") output = require("util").inspect(output, { depth });
				if (output.includes(msg.client.token)) output = output.replace(msg.client.token, "T0K3N");
				if (output !== "undefined") msg.channel.send(Discord.Util.escapeCodeBlock(output), options);
			})
			.catch(err => {
				while (err.stack.includes(msg.client.token)) err.stack = err.stack.replace(msg.client.token, "T0K3N");
				msg.channel.send(
					Discord.Util.escapeCodeBlock(err.stack.replace(/\/home\/cheesits456\/HaileyBot/g, ".")),
					options
				);
			});
	}
}

module.exports = Eval;
