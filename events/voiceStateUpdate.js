module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(oldState, newState) {
		if (oldState.channel && !newState.channel) return;
		const data = await this.client.findOrCreateGuild(newState.guild.id);
		if (
			Object.values(data.stats.staking).includes(newState.channelID) ||
			Object.values(data.stats.volume).includes(newState.channelID)
		) {
			newState.kick();
		}
	}
};
