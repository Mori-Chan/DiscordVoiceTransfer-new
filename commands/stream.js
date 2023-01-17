const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior, EndBehaviorType, createAudioResource, StreamType } = require('@discordjs/voice');
const AudioMixer = require('audio-mixer');
const Prism = require('prism-media');
const { PassThrough } = require('stream');


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
					const mixer = new AudioMixer.Mixer({
						channels: 2,
						bitDepth: 16,
						sampleRate: 48000,
						clearInterval: 250,
					});
					connection1.receiver.speaking.on('start', (userId) => {
						const standaloneInput = new AudioMixer.Input({
							channels: 2,
							bitDepth: 16,
							sampleRate: 48000,
							volume: 100,
						});
						const audioMixer = mixer;
						audioMixer.addInput(standaloneInput);
						const audio = connection1.receiver.subscribe(userId, {
							end: {
								behavior: EndBehaviorType.AfterInactivity,
								duration: 100,
							},
						});
						const rawStream = new PassThrough();
						audio
							.pipe(new Prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 }))
							.pipe(rawStream);
						const p = rawStream.pipe(standaloneInput);
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
							const resource = createAudioResource(mixer,
								{
									inputType: StreamType.Raw,
								},
							);
							player.play(resource);
							connection2.subscribe(player);
							rawStream.on('end', () => {
								if (this.audioMixer != null) {
									this.audioMixer.removeInput(standaloneInput);
									standaloneInput.destroy();
									rawStream.destroy();
									p.destroy();
								}
							});
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