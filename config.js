module.exports = {
	// The token of your Discord Bot
	token: {
		discord: "T0K3N"
	},

	// List of user IDs for users that can use commands in the "owner" category
	owners: ["306018440639152128", "517534579335233579"],

	// Embed color
	embed: {
		color: "#2c75ff"
	},

	// The default prefix for the bot
	prefix: "/",

	// Emojis that the bot uses
	emojis: {
		success: "✅",
		warn: "⚠️",
		error: "❌",
		loading: "💬"
	},

	// Bot statuses - you can set as many as you want, minimum of 1, cycles every 15 seconds
	// - "name" can be whatever string you want, with support for 4 variable values
	//   - "{servers}" will be replaced with the number of servers the bot is in
	//   - "{users}" will be replaced with the total member count of all servers
	//   - "{traders} will be replaced with the number of active traders in the past 24 hours"
	//   - "{trades} will be replaced with the number of trades in the past 24 hours"
	// - "type" must be one of the following strings:
	//   - "PLAYING"
	//   - "STREAMING"
	//   - "LISTENING"
	//   - "WATCHING"
	status: [
		{
			name: "{trades} trades (24h)",
			type: "WATCHING"
		},
		{
			name: "{traders} traders (24h)",
			type: "WATCHING"
		},
		{
			name: "{servers} servers",
			type: "WATCHING"
		},
		{
			name: "{users} users",
			type: "LISTENING"
		}
	]
};
