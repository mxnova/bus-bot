const busModel = require('../models/bus');
const guildModel = require('../models/guild');

module.exports = {
  initialiseBusCollection: async (bus) => {
    const savedBusModels = await busModel.find({ _id: bus._id });

    if (savedBusModels.length === 0) {
      try {
        await bus.save();
        console.log(`Bus ${bus._id} added to database`);
      } catch (err) {
        console.error(err);
      }
    }
  },

  addGuild: async (guild) => {
    const savedGuilds = await guildModel.find({ _id: guild._id });

    if (savedGuilds.length === 0) {
      try {
        await guild.save();
        console.log(`Guild ${guild._id} added to database`);
      } catch (err) {
        console.error(err);
      }
    }
  },
};
