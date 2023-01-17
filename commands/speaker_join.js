const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sjoin')
		.setDescription('Join voice channel!')
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel to join')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildVoice),
		),
	async execute(interaction) {
		const voiceChannel = interaction.options.getChannel('channel');
		const connection = joinVoiceChannel({
			group: 'speaker',
			guildId: interaction.guildId,
			channelId: voiceChannel.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfMute: true,
			selfDeaf: false,
		});
		await interaction.reply('Join VC');
		return connection;
	},
};