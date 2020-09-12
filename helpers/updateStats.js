const fetch = require("node-fetch"),
	puppeteer = require("puppeteer");

module.exports = async (guild, msg) => {
	const client = guild.client;

	// Fetch the guild's configuration object
	let data = await guild.client.findOrCreateGuild(guild.id);

	// Set a variable to keep track of whether any changes have been made to
	// the guild's configuration object
	let modified = false;

	// Base names used for the staking stats channels
	const names = {
		staked: "ZRX staked",
		ends: "Epoch ends in",
		rewards: "Epoch rewards",
	};

	if (Object.keys(data.stats.staking).filter(e => e !== "category").length) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		if (msg) await msg.edit(`${msg.client.config.emojis.loading} | **Loading staking stats page . . .**`);
		await page.goto("https://0x.org/zrx/staking");
		if (msg) await msg.edit(`${msg.client.config.emojis.loading} | **Extracting staking stats . . .**`);
		await guild.client.wait(2000);
		// prettier-ignore
		const staking = await page.$$eval(
			"#app > main:first-of-type > div:nth-of-type(2) > div:first-of-type > div",
			stats => stats.map(stat => stat.innerHTML.match(/<div class=".+?">(.+?)<\/div><div class=".+?">(.+?)<\/div>/))
		);
		await browser.close();

		if (msg) await msg.edit(`${msg.client.config.emojis.loading} | **Updating "Staking Stats" channels . . .**`);
		for (const [stakingStat, id] of Object.entries(data.stats.staking)) {
			let channel = guild.channels.cache.get(id);
			if (!channel) {
				delete data.stats.staking[stakingStat];
				modified = true;
				continue;
			}
			if (stakingStat === "category") continue;
			let stat = staking[Object.keys(names).indexOf(stakingStat)][1];
			if (stakingStat === "staked") stat = stat.toLowerCase();
			const name = `${names[stakingStat]}: ${stat}`;
			if (name !== channel.name) await channel.setName(name);
		}
	}

	if (Object.keys(data.stats.volume).filter(e => !["category, totals"].includes(e)).length) {
		if (msg) await msg.edit(`${msg.client.config.emojis.loading} | **Fetching volume stats . . .**`);
		let channel = guild.channels.cache.get(data.stats.volume.totals);
		if (!channel) {
			delete data.stats.volume.totals;
			modified = true;
		} else {
			// prettier-ignore
			// const value = (await (await fetch("https://api.0xtracker.com/tokens/0xe41d2489571d322189246dafa5ebde1f4699f498")).json()).price.last;

			// prettier-ignore
			const volume = {
			day: ((await (await fetch("https://api.0xtracker.com/stats/network?period=day")).json()).tradeVolume / 1000000).toFixed(1),
			all: ((await (await fetch("https://api.0xtracker.com/stats/network?period=all")).json()).tradeVolume / 1000000000).toFixed(2)
		};

			const name = `$${volume.day}m | $${volume.all}b`;
			if (msg) await msg.edit(`${msg.client.config.emojis.loading} | **Updating volume stats . . .**`);
			if (name !== channel.name) await channel.setName(name);
		}
	}

	if (modified) await data.save();
};
