const busModel = require('../models/bus');

module.exports = {
  initialiseBusCollection: async function (bus) {
    const savedBusModels = await busModel.find({ number: bus.number });

    if (savedBusModels.length === 0) {
      await bus.save();
      console.log(`Bus ${bus.number} added to database`);
    }
  },
};
