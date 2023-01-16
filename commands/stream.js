const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior, EndBehaviorType, createAudioResource, StreamType } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stream')
		.setDescription('Stream VC1 to VC2!'),
	async execute(interaction, connections) {
		if (connections[0] === undefined || connections[1] === undefined) {
			await interaction.reply('VCに接続していません。');
			return;
		}
		else if (connections[0] !== undefined || connections[1] !== undefined) {
			if (connections[0].joinConfig.group !== undefined && connections[1].joinConfig.group !== undefined) {
				let connection1;
				if (connections[0].joinConfig.group === 'listener' || connections[1].joinConfig.group === 'listener') {
					if (connections[0].joinConfig.group === 'listener') {
						connection1 = connections[0];
					}
					else if (connections[1].joinConfig.group === 'listener') {
						connection1 = connections[1];
					}
					connection1.receiver.speaking.on('start', (userId) => {
						// const user = interaction.guild.members.fetch(userId);
						const audio = connection1.receiver.subscribe(userId, {
							end: {
								behavior: EndBehaviorType.AfterSilence,
								duration: 10000,
							},
						});
						// const oggStream = new opus.OggLogicalBitstream({
						// 	opusHead: new opus.OpusHead({ //←ここでエラー発生のため一旦削除
						// 		channelCount: 2,
						// 		sampleRate: 48000,
						// 	}),
						// 	pageSizeControl: {
						// 		maxPackets: 10,
						// 	},
						// });
						let connection2;
						if (connections[0].joinConfig.group === 'speaker' || connections[1].joinConfig.group === 'speaker') {
							if (connections[0].joinConfig.group === 'speaker') {
								connection2 = connections[0];
							}
							else if (connections[1].joinConfig.group === 'speaker') {
								connection2 = connections[1];
							}
							const player = createAudioPlayer({
								behaviors: {
									noSubscriber: NoSubscriberBehavior.play,
								},
							});
							const resource = createAudioResource(audio,
								{
									inputType: StreamType.Opus,
								},
							);
							player.play(resource);
							connection2.subscribe(player);
						}
					});
				}
			}
			else {
				await interaction.editReply('VCに接続していません。');
			}
			await interaction.reply('VCを中継します。');
		}
		return;
	},
};