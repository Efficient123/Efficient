const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banish')
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
		const banishedMember = interaction.options.getMember("evildoer"); // Get the GuildMember instead of User
		const transgression = interaction.options.getString("transgression") ?? "No reason provided";
		const executor = interaction.member;
		const execuse = ["Efficient's anti moderation shield was too hard to penetrate", "Efficient, look someone is trying to banish you, your majesty 🙏", "I will banish you instead", "Uno", "They are too important, unlike you."];

		if (!(executor.roles.cache.has("1193792031751934002") || executor.roles.cache.has("1193771724886511707") || executor.roles.cache.has("1239071556576088094") || executor.roles.cache.has("1193509108364623882"))) {
			await interaction.reply("You do not have permission to use this command.");
		} else if (banishedMember.roles.cache.has("1241383081617915925") || banishedMember.roles.cache.has("1193834032023216168")) {
			await interaction.reply("I cannot banish them.");
		} else if (banishedMember.roles.cache.has("1193509108364623882")) {
			await interaction.reply(`${execuse[Math.floor(Math.random() * execuse.length)]}`);
		} else {
			// Send informative message to the channel where the command was run
			await interaction.reply(`Banished ${banishedMember.user.tag} to ${banishmentLocations[Math.floor(Math.random() * banishmentLocations.length)]}!`);

			// Send more appropriate message to the banished user (optional)
			try {
				await banishedMember.send(`You have been banished (kicked) for ${transgression}. Please consider your actions.`);
			} catch (error) {
				console.error("Failed to send DM:", error);
				// You can also send a message in the channel indicating DM failure
				await interaction.followUp(`Banishment successful! However, I couldn't send a direct message to ${banishedMember.user.tag}.`);
			}

			// Kick the member
			try {
				await banishedMember.kick(transgression);
			} catch (error) {
				console.error("Failed to kick member:", error);
				await interaction.followUp("Failed to banish the user due to an error.");
			}
		}
	},
};
