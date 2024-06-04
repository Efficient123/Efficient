const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('Banish')
		.setDescription('Banishes a user (kick)')
		.addUserOption((option) =>
			option
				.setName("evildoer")  // Changed name from criminal
				.setDescription("The user to be banished")  // Changed description
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("transgression")  // Changed name from reason
				.setDescription("Reason for the banishment")  // Changed description
				.setRequired(false)
		),
	async execute(interaction) {
		const banishmentLocations = ["The island of irrelevant memes", "Backrooms", "The void", "Underworld of ants", "Secret Base of the Scooby Dooby gang", "Hell", "The land of listening", "The logic labyrinth", "The glitch dimension", "Debate Dome", "The hall of sorrow"];
		const banishedUser = interaction.options.getUser("evildoer");
		const transgression = interaction.options.getString("transgression") ?? "No reason provided";
		const executor = interaction.member;

		if (!(executor.roles.cache.has("1193792031751934002") || executor.roles.cache.has("1193771724886511707") || executor.roles.cache.has("1239071556576088094") || executor.roles.cache.has("1193509108364623882"))) {
			await interaction.reply("You do not have permission to use this command.");
		} else {
			// Send informative message to the channel where the command was run
			await interaction.reply(`Banished ${banishedUser} to ${banishmentLocations[Math.floor(Math.random() * banishmentLocations.length)]}!`); // Use banishmentLocations.length for the max index

			// Send more appropriate message to the banished user (optional)
			try {
				await banishedUser.send(`You have been banished (kicked) for ${transgression}. Please consider your actions.`);
			} catch (error) {
				console.error("Failed to send DM:", error);
				// You can also send a message in the channel indicating DM failure
				await interaction.reply(`Banishment successful! However, I couldn't send a direct message to ${banishedUser}.`);
			}

		}
	},
};
