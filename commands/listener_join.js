const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { LISTENER } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ljoin')
		.setDescription('Join voice channel!'),
	async execute(interaction) {
		const connection = joinVoiceChannel({
			group: 'listener',
			guildId: interaction.guildId,
			channelId: LISTENER.VC_ID,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfMute: true,
			selfDeaf: false,
		});
		await interaction.reply('Join VC');
		return connection;
	},
};