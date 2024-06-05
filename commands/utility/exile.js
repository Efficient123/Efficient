const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exile')  // Changed name from Banish
		.setDescription('Casts out a user (kick)')  // Changed description
		.addUserOption((option) =>
			option
				.setName("outlaw")  // Changed name from criminal
				.setDescription("The user to be exiled")  // Changed description
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("sentence")  // Changed name from reason
				.setDescription("Reason for the exile")  // Changed description
				.setRequired(false)
		),
	async execute(i) {
		const destinations = ["The island of irrelevant memes", "Backrooms", "The void", "Underworld of ants", "Secret Base of the Scooby Dooby gang", "Hell", "The land of listening", "The logic labyrinth", "The glitch dimension", "Debate Dome", "The hall of sorrow"];
		const outlaw = i.options.getMember("outlaw");
		const sentence = i.options.getString("sentence") ?? "No reason provided";
		const enforcer = i.member;
		const execuse = ["Efficient's anti moderation shield was too hard to penetrate", "Efficient, look someone is trying to exile you, your majesty 🙏", "I will exile you instead", "Uno", "They are too important, unlike you."];

		if (!(enforcer.roles.cache.has("1193792031751934002") || enforcer.roles.cache.has("1193771724886511707") || enforcer.roles.cache.has("1239071556576088094") || enforcer.roles.cache.has("1193509108364623882"))) {
			await i.reply("You do not have permission to use this command.");
		} else if (outlaw.roles.cache.has("1241383081617915925") || outlaw.roles.cache.has("1193834032023216168")) {
			await i.reply("I cannot exile them.");
		} else if (outlaw.roles.cache.has("1193509108364623882")) {
			await i.reply(`${execuse[Math.floor(Math.random() * execuse.length)]}`);
		} else {
			// Send informative message to the channel where the command was run
			await i.reply(`Exiled ${outlaw.user.tag} to ${destinations[Math.floor(Math.random() * destinations.length)]}!`);

			// Send more appropriate message to the exiled user (optional)
			try {
				await outlaw.send(`You have been exiled (kicked) for ${sentence}. Please consider your actions.`);
			} catch (error) {
				console.error("Failed to send DM:", error);
				// You can also send a message in the channel indicating DM failure
				await i.followUp(`Exile successful! However, I couldn't send a direct message to ${outlaw.user.tag}.`);
			}

			// Kick the member
			try {
				await outlaw.kick(sentence);
			} catch (error) {
				console.error("Failed to kick member:", error);
				await i.followUp("Failed to exile the user due to an error.");
			}
		}
	},
};
