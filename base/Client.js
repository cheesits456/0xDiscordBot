const Discord = require("discord.js"),
	{ Collection } = Discord,
	fs = require("fs"),
	util = require("util"),
	path = require("path"),
	Twitter = require("twit");

// Creates Client class
class Client extends Discord.Client {
	constructor(options) {
		super(options);
		this.config = require("../config");
		this.config.emojis = {
			success: "✅",
			warn: "⚠️",
			error: "❌",
			loading: "💬"
		};
		this.config.token = process.env.DISCORD_TOKEN;
		this.config.twitterTokens = {
			consumer_key: process.env.TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
			access_token: process.env.TWITTER_ACCESS_TOKEN,
			access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
		}
		if (this.config.feedIcons) this.config.icons = require("./Icons");
		if (Object.values(this.config.twitterTokens).filter(a => a).length === 4)
			this.twitter = new Twitter(this.config.twitterTokens);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.logger = require("../helpers/logger");
		this.wait = util.promisify(setTimeout);
		this.functions = require("../helpers/functions");
		this.updateStats = require("../helpers/updateStats.js");
	}

	// This function is used to load a command and add it to the collection
	loadCommand(commandPath, commandName) {
		try {
			const props = new (require(`.${commandPath}${path.sep}${commandName}`))(this);
			props.conf.location = commandPath;
			if (props.init) props.init(this);
			this.commands.set(props.conf.name, props);
			props.conf.aliases.forEach(alias => this.aliases.set(alias, props.conf.name));
			return;
		} catch (e) {
			this.logger.error(e);
		}
	}

	// This function is used to find guild data or create it
	async findOrCreateGuild(guild) {
		try {
			let path = `./guilds/${guild}.json`;
			if (!fs.existsSync(path)) path = "./base/Guild.json";
			let data = JSON.parse(await fs.promises.readFile(path, "utf8"));
			if (!data.id) data.id = guild;
			data.save = async function () {
				await fs.promises.writeFile(`./guilds/${this.id}.json`, JSON.stringify(this, null, "\t"), "utf8");
			};
			if (path === "./base/Guild.json") await data.save();
			return data;
		} catch (e) {
			this.logger.error(e);
		}
	}
}

module.exports = Client;
