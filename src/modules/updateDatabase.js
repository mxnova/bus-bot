const busModel = require('../models/bus');
const guildModel = require('../models/guild');

module.exports = {
  initialiseBusCollection: async (bus) => {
    if (!(await busModel.findOne({ _id: bus._id }))) {
      try {
        await bus.save();
        console.log(`Bus ${bus._id} added to database`);
      } catch (err) {
        console.error(err);
      }
    }
  },
};
