const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("death_sentence")
		.setDescription("Sentence a user to death (ban)")
		.addUserOption((option) =>
			option
				.setName("criminal")
				.setDescription("The user to be banned")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for the ban")
				.setRequired(false),
		),
	async execute(interaction) {
		const offender = interaction.options.getUser("criminal");
		const reason =
			interaction.options.getString("reason") ?? "No reason provided";
		const executer = interaction.member;
		if (
			!executer.roles.cache.has(1239071556576088094) ||
			executer.roles.cache.has(1193792031751934002) ||
			executer.roles.cache.has(1193771724886511707)
		) {
			await interaction.reply(
				"You do not have permission to use this command.",
			);
		} else {
			await interaction.reply(
				`Sentenced ${offender.username} to death for reason: ${reason}`,
			);
			await interaction.guild.members.ban(offender);
		}
	},
};
