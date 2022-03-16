const scrapeBusLocations = require('./scrapeBusLocations');
const busModel = require('../models/bus');
const { updateBusLocations } = require('./updateDatabase');

module.exports = async () => {
  const currentBusData = await scrapeBusLocations();
  const savedBuses = await busModel.find();
  const changedBuses = [];

  for (const currentBus of currentBusData) {
    const foundBus = await savedBuses.find(
      (savedBus) => savedBus._id === currentBus._id
    );
    if (foundBus.location !== currentBus.location) changedBuses.push(foundBus);
  }

  // Save the changed bus locations to the database
  try {
    await updateBusLocations(changedBuses);
  } catch (err) {
    console.error(err);
  }

  return changedBuses;
};
