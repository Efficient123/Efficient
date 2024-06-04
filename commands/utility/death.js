const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('death_sentence')
		.setDescription('sentences a user to death\(ban\)')
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
	async execute(i) {
		const offender = i.options.getUser("criminal");
		const reason = i.options.getString("reason") ?? "No reason provided";
    const executer = i.member;
		if (!(executer.roles.cache.has("1193792031751934002") || executer.roles.cache.has("1193771724886511707") || executer.roles.cache.has("1239071556576088094") || executer.roles.cache.has("1193509108364623882"))) {
			await i.reply("You do not have permission to use this command.");
		} else {
			await i.reply(`Sentenced ${offender} to death for ${reason}`);
			try {
				offender.send(`You have been sentenced to death for ${reason}`);
			} catch(e) {
        console.log(e)
			}
			await i.guild.members.ban(offender, { reason: reason });
		}
	},
};
