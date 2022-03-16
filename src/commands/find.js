const { SlashCommandBuilder } = require('@discordjs/builders');
const guildModel = require('../models/guild');
const busModel = require('../models/bus');
const BusEmbed = require('../embeds/bus');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('find')
    .setDescription('Locate a bus!')
    .addRoleOption((option) =>
      option
        .setName('bus')
        .setDescription('The bus to locate!')
        .setRequired(true)
    ),
  async execute(interaction) {
    const busRole = await interaction.options.getRole('bus');

    // If user requested a role other than a known bus role, return
    if (!(await guildModel.findOne({ 'busRoles.name': busRole.name }))) {
      await interaction.reply("This isn't a bus!");
      return;
    }

    if (new Date().getUTCDay() % 6 === 0) {
      await interaction.reply("The buses don't run on the weekend!");
      return;
    }

    const requestedBus = await busModel.findOne({ _id: busRole.name });

    if (!requestedBus) {
      await interaction.reply(
        'The requested bus was not found in the database! D:'
      );
      return;
    }

    // Reply with an embed containing the buses location
    await interaction.reply({
      embeds: [
        new BusEmbed(interaction.client, interaction.guild, requestedBus),
      ],
    });
  },
};
