const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { guildId } = require("../../config.json");
const fs = require("fs");
const path = require("path");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("jail")
		.setDescription("Jails the user")
		.addUserOption((option) =>
			option
				.setName("criminal")
				.setDescription("The user to be jailed.")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("time")
				.setDescription('Type "life" for a life sentence or provide the number of days, hours, or minutes.')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for the sentence.")
				.setRequired(false),
		),
	async execute(i) {
		const outlaw = i.options.getMember("criminal");
		const time = i.options.getString("time");
		const reason = i.options.getString("reason") ?? "No reason provided";
		const enforcer = i.member;
		const client = i.client;
		let release = null;

		if (
			!(
				enforcer.roles.cache.has("1193792031751934002") ||
				enforcer.roles.cache.has("1193771724886511707") ||
				enforcer.roles.cache.has("1239071556576088094") ||
				enforcer.roles.cache.has("1193509108364623882")
			)
		) {
			await i.reply("You do not have permission to use this command.");
			return;
		} else if (
			outlaw.roles.cache.has("1241383081617915925") ||
			outlaw.roles.cache.has("1193834032023216168")
		) {
			await i.reply("I cannot jail them.");
			return;
		} else if (outlaw.roles.cache.has("1243049250447949905")) {
			await i.reply("They are already jailed.");
			return;
		} else {
			let parsedTime = parseFloat(time);

			if (isNaN(parsedTime) && time !== "life") {
				await i.reply(
					time + " is not a valid time, write life for a life sentence or provide a valid number of days, hours, or minutes.",
				);
				return;
			} else {
				const cell = await i.guild.channels.create({
					name: `cell-${outlaw.displayName}`,
					type: ChannelType.GuildText,
					parent: "1247820196580687947",
					permissionOverwrites: [
						{
							id: guildId,
							deny: [PermissionFlagsBits.ViewChannel],
						},
						{
							id: outlaw.id,
							allow: [
								PermissionFlagsBits.ViewChannel,
								PermissionFlagsBits.SendMessages,
							],
						},
					],
				});
				const cellId = cell.id;
				const cellObj = client.channels.cache.get(cell.id);

				if (time === "life") {
					release = "life";
				} else {
					const currentDate = new Date();
					const timeUnit = time.split(" ").pop().toLowerCase();
					const timeValue = parseFloat(time);

					if (isNaN(timeValue)) {
						await i.reply(
							time + " is not a valid time, write life for a life sentence or provide a valid number of days, hours, or minutes.",
						);
						return;
					}

					if (timeUnit.startsWith("d")) {
						currentDate.setTime(currentDate.getTime() + timeValue * 24 * 60 * 60 * 1000);
					} else if (timeUnit.startsWith("h")) {
						currentDate.setTime(currentDate.getTime() + timeValue * 60 * 60 * 1000);
					} else if (timeUnit.startsWith("m")) {
						currentDate.setTime(currentDate.getTime() + timeValue * 60 * 1000);
					} else {
						await i.reply(
							time + " is not a valid time unit. Use 'days', 'hours', or 'minutes'.",
						);
						return;
					}
					release = currentDate;
				}

				const logs = {
					"name": outlaw.displayName,
					"id": outlaw.id,
					"cell": cellId,
					"time": release,
					"reason": reason
				};

				try {
					await outlaw.roles.add("1243049250447949905");
					await i.reply(`Sentenced ${outlaw.user.tag} to ${time === "life" ? "life imprisonment" : time} for ${reason}`);
					const punishFilePath = path.join(__dirname, "punish.json");

					fs.readFile(punishFilePath, "utf8", (err, data) => {
						if (err) {
							console.error("Error reading punish.json:", err);
							return;
						}

						let punishments = JSON.parse(data);

						punishments.push(logs);

						fs.writeFile(punishFilePath, JSON.stringify(punishments, null, 2), "utf8", (err) => {
							if (err) {
								console.error("Error writing to punish.json:", err);
								return;
							}
							console.log("Punishment log added successfully.");
						});
					});
				} catch (e) {
					await i.reply("Something went wrong.");
				}

				try {
					cellObj.send(`${outlaw} you are imprisoned for ${reason}, you are sentenced to ${time === "life" ? "life" : time}.`);
				} catch (e) {
					await i.followUp("I am unable to notify them, please ping them in their cell channel, thanks.");
				}
			}
		}
	},
};
