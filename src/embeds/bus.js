const { MessageEmbed } = require('discord.js');

module.exports = class BusEmbed extends MessageEmbed {
  constructor(client, guild, bus) {
    super()
      // @ts-ignore
      .setAuthor({
        name: 'Bus Bot',
        url: 'https://webservices.runshaw.ac.uk/bus/busdepartures.aspx',
        iconURL: client.user.avatarURL(),
      })
      .setColor(0xe63312)
      .setFooter({
        text: `Brought to you by ${guild.name}`,
        iconURL: guild.iconURL(),
      })
      .setImage('https://webservices.runshaw.ac.uk/bus/BusLaneMap.png')
      .setTimestamp(Date.now())
      .setTitle(`Location of ${bus._id}`)
      .setURL(
        `https://webservices.runshaw.ac.uk/bus/busdepartures.aspx?Service=${bus._id}`
      )
      .addFields(
        { name: 'Bus:', value: bus._id, inline: true },
        {
          name: 'Location:',
          // If the bus doesn't have a location, set its location to Not yet arrived
          value: bus.location.replace(/\s/g, '')
            ? bus.location
            : 'Not yet arrived!',
          inline: true,
        }
      );
  }
};
