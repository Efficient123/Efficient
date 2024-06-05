const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('release')
		.setDescription('Releases a user.')
		.addUserOption((option) =>
			option
				.setName("criminal")
				.setDescription("The user to be released")
				.setRequired(true)
		),
	async execute(i) {
		const offender = i.options.getMember("criminal"); // Get the GuildMember instead of User
		const executer = i.member;

		if (!(executer.roles.cache.has("1193792031751934002") || executer.roles.cache.has("1193771724886511707") || executer.roles.cache.has("1239071556576088094") || executer.roles.cache.has("1193509108364623882"))) {
			await i.reply("You do not have permission to use this command.");
			return;
		} 

		if (!offender.roles.cache.has("1243049250447949905")) {
			await i.reply("They are not in jail.");
			return;
		}

		const punishFilePath = path.join(__dirname, "punish.json");

		fs.readFile(punishFilePath, "utf8", async (err, data) => {
			if (err) {
				console.error("Error reading punish.json:", err);
				await i.reply("There was an error accessing the punishment records.");
				return;
			}

			let punishments = JSON.parse(data);
			const punishmentIndex = punishments.findIndex(p => p.id === offender.id);

			if (punishmentIndex === -1) {
				await i.reply("No record of this user in punish.json.");
				return;
			}

			const punishment = punishments[punishmentIndex];

			try {
				const cellChannel = i.guild.channels.cache.get(punishment.cell);
				if (cellChannel) {
					await cellChannel.delete();
				}
			} catch (e) {
				console.error("Error deleting cell channel:", e);
			}

			punishments.splice(punishmentIndex, 1);

			fs.writeFile(punishFilePath, JSON.stringify(punishments, null, 2), "utf8", async (err) => {
				if (err) {
					console.error("Error writing to punish.json:", err);
					await i.reply("There was an error updating the punishment records.");
					return;
				}

				try {
					await offender.roles.remove("1243049250447949905");
					await offender.send(`You have been released.`);
					await i.reply(`Released ${offender.user.tag} from jail.`);
				} catch (e) {
					console.error("Error removing jail role or sending message:", e);
					await i.reply("There was an error releasing the user.");
				}
			});
		});
	},
};
