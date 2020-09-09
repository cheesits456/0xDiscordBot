const config = require("../config");

module.exports = {
	getPrefix: (msg, data) => {
		// prettier-ignore
		const prefixes = [
			`<@${msg.client.user.id}> `,
			`<@!${msg.client.user.id}> `,
			msg.client.user.username,
			data.guild?.prefix || msg.client.config.prefix
		];
		let prefix;
		for (const p of prefixes) {
			if (msg.content.startsWith(p)) prefix = p;
		}
		return prefix;
	},

	capitalize: (text, all) => {
		let r = all ? text.replace(/(?<=\s)\w/g, c => c.toUpperCase()) : text;
		return r.replace(/^\w/, c => c.toUpperCase());
	},

	msFix: ms => {
		let y, d, h, m, s;
		s = Math.floor(ms / 1000);
		m = Math.floor(s / 60);
		h = Math.floor(m / 60);
		d = Math.floor(h / 24);
		y = Math.floor(d / 365);
		if (y) return `${y}y, ${d - Math.floor(y * 365.25)}d`;
		if (d) return `${d}d, ${h - d * 24}h`;
		if (h) return `${h}h, ${m - h * 60}m`;
		if (m) return `${m}m, ${s - m * 60}s`;
		if (s) return `${s}s`;
	},

	intFix: (number, decimalPlaces, keepZeros) => {
		if (typeof number !== "string") number = String(number);
		let [whole, decimals = ""] = number.split(".");
		whole = parseInt(whole, 10).toLocaleString();
		decimals = Number(decimals.substring(0, decimalPlaces + 1));
		decimals = String(Math.round(decimals / 10));
		if (keepZeros) {
			while (decimals.length < decimalPlaces) decimals += "0";
		} else {
			while (decimals.endsWith("0")) decimals = decimals.substring(0, decimals.length - 1);
		}
		return `${whole}${decimals ? `.${decimals}` : ""}`;
	},
};
