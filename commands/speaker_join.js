const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { SPEAKER } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sjoin')
		.setDescription('Join voice channel!'),
	async execute(interaction) {
		const connection = joinVoiceChannel({
			group: 'speaker',
			guildId: interaction.guildId,
			channelId: SPEAKER.VC_ID,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfMute: false,
			selfDeaf: true,
		});
		await interaction.reply('Join VC');
		return connection;
	},
};