const { REST, Routes } = require('discord.js');
const { LISTENER, SPEAKER } = require('./config.json');
const fs = require('node:fs');


const ListenerCommand = [];
const SpeakerCommand = [];
// Grab all the command files from the commands directory you created earlier
const ListenerCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && (file.startsWith('listener') || file.startsWith('bye') || file.startsWith('stream')));
const SpeakerCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && (file.startsWith('speaker') || file.startsWith('bye') || file.startsWith('stream')));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const LiFile of ListenerCommandFiles) {
	const LiCommand = require(`./commands/${LiFile}`);
	ListenerCommand.push(LiCommand.data.toJSON());
}

for (const SpFile of SpeakerCommandFiles) {
	const SpCommand = require(`./commands/${SpFile}`);
	SpeakerCommand.push(SpCommand.data.toJSON());
}

// Construct and prepare an instance of the REST module
const Listener_rest = new REST({ version: '10' }).setToken(LISTENER.TOKEN);
const Speaker_rest = new REST({ version: '10' }).setToken(SPEAKER.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${ListenerCommand.length} application (/) commands of Listener.`);
		console.log(`Started refreshing ${SpeakerCommand.length} application (/) commands of Speaker.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const Listener_data = await Listener_rest.put(
			Routes.applicationGuildCommands(LISTENER.CLIENT_ID, LISTENER.GUILD_ID),
			{ body: ListenerCommand },
		);
		const Speaker_data = await Speaker_rest.put(
			Routes.applicationGuildCommands(SPEAKER.CLIENT_ID, SPEAKER.GUILD_ID),
			{ body: SpeakerCommand },
		);

		console.log(`Successfully reloaded ${Listener_data.length} application (/) commands.`);
		console.log(`Successfully reloaded ${Speaker_data.length} application (/) commands.`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();