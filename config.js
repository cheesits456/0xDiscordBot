module.exports = {
	// Whether or not to use token icon emojis in transaction feed channel
	feedIcons: true,

	// Users who are allowed to use the restart command (Discord user IDs)
	owners: [
		"306018440639152128",
		"517534579335233579"
	],

	// The default prefix for the bot
	prefix: "!",

	// Bot statuses - you can set as many as you want, minimum of 1, cycles every 15 seconds
	// - "name" can be whatever string you want, with support for 4 variable values
	//   - "{traders} will be replaced with the number of active traders in the past 24 hours"
	//   - "{trades} will be replaced with the number of trades in the past 24 hours"
	// - "type" must be one of the following strings:
	//   - "PLAYING"
	//   - "STREAMING"
	//   - "LISTENING"
	//   - "WATCHING"
	statuses: [
		{
			name: "{trades} trades (24h)",
			type: "WATCHING"
		},
		{
			name: "{traders} traders (24h)",
			type: "LISTENING"
		}
	],

	// The token of your Discord Bot
	token: "T0K3N"
};
