const busModel = require('../models/bus');

module.exports = {
  initialiseBusCollection: async (buses) => {
    for (const bus of buses) {
      if (!(await busModel.findById(bus._id))) {
        try {
          await bus.save();
          console.log(`Bus ${bus._id} added to database`);
        } catch (err) {
          console.error(err);
        }
      }
    }

    await busModel.updateMany({}, { location: ' ' });
  },
  updateBusLocations: async (buses) => {
    for (const bus of buses) {
      if ((await busModel.findById(bus._id)).location !== bus.location) {
        try {
          await busModel.updateOne(
            { _id: bus._id },
            { location: bus.location }
          );
        } catch (err) {
          console.error(err);
        }
      }
    }
  },
};
