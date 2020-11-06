const chalk = require("chalk"),
	{ black, blueBright, cyanBright, greenBright, grey, magenta, redBright, yellow } = chalk;

// Make the logger always output color escape codes
chalk.level = 1;

const splice = (string, i, r, s) => `${string.slice(0, i)}${s}${string.slice(i + Math.abs(r))}`;

const format = d =>
	`${splice(d.getFullYear().toString(), 0, 2, "")}-` +
	`${pad(d.getMonth() + 1, 2)}-` +
	`${pad(d.getDate(), 2)} ` +
	`${pad(d.getHours(), 2)}:` +
	`${pad(d.getMinutes(), 2)}:` +
	`${pad(d.getSeconds(), 2)}.` +
	pad(d.getMilliseconds(), 3);

function pad(value, digits) {
	while (value.toString().length < digits) value = `0${value}`;
	return value;
}

function typeName(type) {
	// prettier-ignore
	switch (type) {
		case "warn": return yellow("WRN");
		case "error": return redBright("ERR");
		case "debug": return magenta("DBG");
		case "cmd": return cyanBright("CMD");
		case "ready": return greenBright("RDY");
		default: return blueBright("LOG");
	}
}

class Logger {
	static log(content, options = {}) {
		if (typeof options === "string") options = { type: options };
		if (!options.type) options.type = "log";
		if (typeof content !== "string") {
			if (
				typeof content === "object" &&
				Object.prototype.toString.call(content).match(/\[object (.+)]/)[1] === "Error"
			) {
				content = content.stack;
				options.type = "error";
			} else content = require("util").inspect(content, { depth: 1 });
		}

		content = content.replace(new RegExp(process.env.PWD, "g"), ".");
		for (const line of content.split("\n"))
			console.log(`${grey(`[${format(new Date())}]`)} ${typeName(options.type, true)} ${line}`);
	}

	static error(log, options = {}) {
		options.type = "error";
		this.log(log, options);
	}

	static warn(log, options = {}) {
		options.type = "warn";
		this.log(log, options);
	}

	static debug(log, options = {}) {
		options.type = "debug";
		this.log(log, options);
	}

	static cmd(log, options = {}) {
		options.type = "cmd";
		this.log(log, options);
	}

	static ready(log, options = {}) {
		options.type = "ready";
		this.log(log, options);
	}
}

module.exports = Logger;
