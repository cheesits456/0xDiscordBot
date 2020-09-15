const Command = require("../base/Command.js"),
	Discord = require("discord.js");

class Eval extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			guildOnly: false,
			aliases: ["exec"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES"],
			ownerOnly: true,
			cooldown: 3000
		});
	}

	async run(msg, args, data) {
		const fetch = require("node-fetch"),
			fs = require("fs"),
			http = require("http"),
			https = require("https");

		const client = msg.client,
			config = client.config;

		const options = {
			split: true,
			code: "js"
		};

		const match = args[0].match(/--(depth)=(\d+)/);
		const depth = match && match[1] === "depth" ? parseInt(match[2]) : 0;

		const content = msg.content
			.split(" ")
			.slice(match || !msg.content.startsWith(data.guild?.prefix || config.prefix) ? 2 : 1)
			.join(" ");
		const result = new Promise((resolve, reject) => resolve(eval(content)));

		return result
			.then(output => {
				if (typeof output !== "string") output = require("util").inspect(output, { depth });
				if (output.includes(msg.client.token)) output = output.replace(msg.client.token, "T0K3N");
				if (output !== "undefined") msg.channel.send(output, options);
			})
			.catch(err => {
				if (err.stack.includes(msg.client.token)) err.stack = err.stack.replace(msg.client.token, "T0K3N");
				msg.channel.send(err.stack.replace(new RegExp(process.env.PWD, "g"), "."), options);
			});
	}
}

module.exports = Eval;
