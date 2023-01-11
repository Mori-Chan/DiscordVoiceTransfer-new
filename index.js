const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { LISTENER, SPEAKER } = require('./config.json');

const clients = [ new Client({ intents: [GatewayIntentBits.Guilds] }), new Client({ intents: [GatewayIntentBits.Guilds] }) ];

const commandsPath = path.join(__dirname, 'commands');
const CommandFiles = [fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && (file.startsWith('listener') || file.startsWith('bye'))), fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && (file.startsWith('speaker') || file.startsWith('bye')))];


for (let i = 0; i < clients.length; i++) {
	clients[i].commands = new Collection();

	for (const file of CommandFiles[i]) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			clients[i].commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}

	clients[i].on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	});

	clients[i].once(Events.ClientReady, c => {
		console.log(`Ready! Logged in as ${c.user.tag}`);
	});
	if (i == 0) {
		clients[i].login(LISTENER.TOKEN);
	}
	else {
		clients[i].login(SPEAKER.TOKEN);
	}
}
