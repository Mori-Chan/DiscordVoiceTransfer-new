const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('bye')
		.setDescription('Disconnect voice channel!'),
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
		const connections = [ getVoiceConnection(memberVC.guild.id, 'listener'), getVoiceConnection(memberVC.guild.id, 'speaker') ];
		for (const connection of connections) {
			if (connection != undefined) {
				connection.destroy();
			}
		}
		await interaction.reply('Bye VC');
		return;
	},
};