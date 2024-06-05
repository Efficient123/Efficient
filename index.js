const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, guildId } = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
	],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	checkPunishments();
	setInterval(checkPunishments, 50 * 1000); // Check every 5 minutes
});

client.on(Events.InteractionCreate, async interaction => {
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
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

const punishFilePath = path.join(__dirname, 'commands', 'utility', 'punish.json');

async function checkPunishments() {
	try {
		const data = fs.readFileSync(punishFilePath, 'utf8');
		const punishments = JSON.parse(data);
		const currentDate = new Date();

		for (let i = punishments.length - 1; i >= 0; i--) {
			const punishment = punishments[i];
			if (punishment.time !== 'life' && new Date(punishment.time) <= currentDate) {
				const guild = await client.guilds.fetch(guildId);
				const member = await guild.members.fetch(punishment.id);
				const channel = guild.channels.cache.get(punishment.cell);

				if (member) {
					await member.roles.remove('1243049250447949905'); // Replace with your jailed role ID
					try {
						await member.send(`You have been released from jail.`);
					} catch (err) {
						console.log(`Could not send a DM to ${member.user.tag}.`);
					}
					console.log(`Released ${member.user.tag} from jail.`);
				}

				if (channel) {
					await channel.delete();
					console.log(`Deleted channel ${channel.name}`);
				}

				// Remove the punishment from the array
				punishments.splice(i, 1);
			}
		}

		// Write the updated punishments array back to the file
		fs.writeFileSync(punishFilePath, JSON.stringify(punishments, null, 2), 'utf8');
	} catch (error) {
		console.error('Error checking punishments:', error);
	}
}

client.login(token);
