const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { LISTENER } = require('../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('sjoin')
		.setDescription('Join voice channel!'),
	async execute(interaction) {
		const guild = interaction.guild;
		const member = await guild.members.fetch(interaction.member.id);
		const memberVC = member.voice.channel;
		if (!memberVC) {
			console.log('接続先のVCが見つかりません。');
		}
		if (!memberVC.joinable) {
			console.log('VCに接続できません。');
		}
		if (!memberVC.speakable) {
			console.log('VCで音声を再生する権限がありません。');
		}
		const connection = joinVoiceChannel({
			guildId: LISTENER.GUILD_ID,
			channelId: LISTENER.VC_ID,
			adapterCreator: guild.voiceAdapterCreator,
			selfMute: true,
			selfDeaf: false,
		});
		await interaction.reply('Join VC');
		return;
	},
};