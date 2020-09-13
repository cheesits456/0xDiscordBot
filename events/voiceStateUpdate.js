// Automatically disconnect users from the live stat voice channels
// (the permission that stops users from joining doesn't apply to server administrators)

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(oldState, newState) {
		if (oldState.channel && !newState.channel) return;
		const data = await this.client.findOrCreateGuild(newState.guild.id);

		let isStatChannel = false;
		for (const config of ["staking", "volume"]) {
			if (Object.values(data.stats[config]).includes(newState.channelID)) isStatChannel = true;
		}

		if (isStatChannel) newState.kick();
	}
};
