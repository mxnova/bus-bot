const getChangedBuses = require('./getChangedBuses');
const guildModel = require('../models/guild');
const BusEmbed = require('../embeds/bus');

module.exports = async (client) => {
  const changedBuses = await getChangedBuses();

  // If buses haven't changed, return
  if (changedBuses.length === 0) return;

  const guilds = await guildModel.find();

  const busChannels = [];
  for (const savedGuild of guilds) {
    const guild = await client.guilds.cache.get(savedGuild._id);
    // If a saved guild no longer exists, remove it from the database
    if (!guild) {
      await guildModel.deleteOne({ _id: savedGuild._id });
      continue;
    }

    let busChannel = await client.channels.cache.get(savedGuild.busChannelId);
    // If saved bus channel no longer exists, create a new channel and update the database
    if (!busChannel) {
      const newBusChannelId = (
        await guild.channels.create('bus-updates', {
          reason: 'Bus Channel missing',
        })
      )
        .toString()
        .replace(/\D/g, '');

      await guildModel.updateOne(
        { _id: savedGuild._id },
        { busChannelId: newBusChannelId }
      );

      busChannel = await client.channels.cache.get(newBusChannelId);
    }

    busChannels.push(busChannel);
  }

  // Send updates for the changed buses to every bus channel
  for (const channel of busChannels) {
    await Promise.all(
      changedBuses.map(async (bus) =>
        channel.send({
          // content contains the role ping and location that will appear in a notification
          content: `${await channel.guild.roles.cache.find(
            (role) => role.name === bus._id
          )} has arrived at ${bus.location}!`,
          embeds: [new BusEmbed(client, channel.guild, bus)],
        })
      )
    );
  }
};
