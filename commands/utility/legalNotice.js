const { SlashCommandBuilder } = require('discord.js');

module.exports = {
		data: new SlashCommandBuilder()
				.setName('legal_notice')  
				.setDescription('Sends the user a legal notice (warn)')  
				.addUserOption((option) =>
						option
								.setName("outlaw")  
								.setDescription("The user to be warned")  
								.setRequired(true)
				)
				.addStringOption((option) =>
						option
								.setName("reason")  
								.setDescription("Reason for the warn")  
								.setRequired(true)
				),
		async execute(i) {
				const outlaw = i.options.getMember("outlaw");
				const reason = i.options.getString("reason");
				const enforcer = i.member;
				if (!(enforcer.roles.cache.has("1193792031751934002") || enforcer.roles.cache.has("1193771724886511707") || enforcer.roles.cache.has("1239071556576088094") || enforcer.roles.cache.has("1193509108364623882"))) {
						await i.reply("You do not have permission to use this command.");
				} else if (outlaw.roles.cache.has("1241383081617915925") || outlaw.roles.cache.has("1193834032023216168")) {
						await i.reply("I cannot exile them.");
				} else {
						try {
								await outlaw.send(`You have been warned for ${reason}. Please consider your actions.`);
								await i.reply("User warned successfully.");
						} catch (error) {
								console.error("Failed to send DM:", error);
								await i.reply("User has their DMs disabled, kindly ping them in a general channel.");
						}
				}
		},
};
