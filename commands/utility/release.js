const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('releass')
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
		const execuse = [
			"Efficient's anti-moderation shield was too hard to penetrate",
			"Efficient, look someone is trying to execute you, your majesty 🙏",
			"I will execute you instead",
			"Uno",
			"They are too important, unlike you."
		];

		if (!(executer.roles.cache.has("1193792031751934002") || executer.roles.cache.has("1193771724886511707") || executer.roles.cache.has("1239071556576088094") || executer.roles.cache.has("1193509108364623882"))) {
			await i.reply("You do not have permission to use this command.");
		} else if (!(offender.roles.cache.has("1243049250447949905"))) {
			await i.reply("They are not in jail.");
		} else {
			await i.reply(`Sentenced ${offender.user.tag} to death for ${reason}`); // Use offender.user.tag for username
			try {
				await offender.send(`You have been released.`);
				offender.roles.cache.remove("1243049250447949905")
			} catch (e) {
				console.log(e);
			}
		}
	},
};
