const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guildModel = require('../models/guild');
const scrape = require('../modules/scrape');

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

    let busLocations;
    try {
      busLocations = await scrape();
    } catch {
      // If the scrape failed, return
      // Check if it is currently a weekend
      if (new Date().getUTCDay() % 6 === 0) {
        await interaction.reply("The buses don't run on the weekend!");
        return;
      }

      await interaction.reply('Bus locations are not yet available today!');
      return;
    }

    // Select the location of the requested bus
    const requestedBusLocation = await busLocations.find(
      (busLocation) => busLocation._id === busRole.name
    );

    // Reply with an embed containing the buses location
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: 'Bus Bot',
            url: 'https://webservices.runshaw.ac.uk/bus/busdepartures.aspx',
            iconURL: interaction.client.user.avatarURL(),
          })
          .setColor(0xe63312)
          .setFooter({
            text: `Brought to you by ${interaction.guild.name}`,
            iconURL: interaction.guild.iconURL(),
          })
          .setImage('https://webservices.runshaw.ac.uk/bus/BusLaneMap.png')
          .setTimestamp(Date.now())
          .setTitle(`Location of ${requestedBusLocation._id}`)
          .setURL(
            `https://webservices.runshaw.ac.uk/bus/busdepartures.aspx?Service=${requestedBusLocation._id}`
          )
          .addFields(
            { name: 'Bus:', value: requestedBusLocation._id, inline: true },
            {
              name: 'Location:',
              // If the bus doesn't have a location set its location to Not yet arrived
              value: requestedBusLocation.location.replace(/\s/g, '')
                ? requestedBusLocation.location
                : 'Not yet arrived!',
              inline: true,
            }
          ),
      ],
    });
  },
};
