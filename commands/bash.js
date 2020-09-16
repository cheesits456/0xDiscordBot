const Command = require("../base/Command.js"),
	{ spawn } = require("child_process");

class Bash extends Command {
	constructor(client) {
		super(client, {
			name: "bash",
			guildOnly: false,
			aliases: [],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES"],
			ownerOnly: true,
			cooldown: 0
		});
	}

	async run(msg, args, data) {
		if (!args[0]) return msg.channel.send(`${msg.client.config.emojis.error} | Must provide a command to execute`);

		const options = {
			code: "js",
			split: true
		};

		const command = args.shift();
		let output = "";

		let cmd = spawn(command, args, {
			shell: "bash",
			env: { COLUMNS: 128 }
		});

		cmd.stdout.on("data", data => (output += data));
		cmd.stderr.on("data", data => (output += data));

		cmd.on("exit", () => {
			if (output) msg.channel.send(output, options);
		});
	}
}

module.exports = Bash;
