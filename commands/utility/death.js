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
		const execuse = ["Efficient's anti moderation sheild was too hard to penetrate", "Efficient, look someone is trying to execute you, your majesty 🙏", "I will execute you instead", "Uno", "They are too important, unlike you."]
		if (!(executer.roles.cache.has("1193792031751934002") || executer.roles.cache.has("1193771724886511707") || executer.roles.cache.has("1239071556576088094") || executer.roles.cache.has("1193509108364623882"))) {
			await i.reply("You do not have permission to use this command.");
		} else if (offender.roles.cache.has("1241383081617915925") || offender.roles.cache.has("1193834032023216168")){
			await i.reply("I cannot execute them.")
		} else if (offender.roles.cache.has("1193509108364623882")) {
			await i.reply(`${execuse[Math.floor(Math.random() * execuse.length)]}`)
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
