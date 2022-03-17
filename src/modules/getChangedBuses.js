const scrapeBusLocations = require('./scrapeBusLocations');
const busModel = require('../models/bus');
const { updateBusLocations } = require('./updateDatabase');

module.exports = async () => {
  const currentBusData = [];
  // If scrape fails, return a blank list signifying no changed buses
  try {
    currentBusData.concat(await scrapeBusLocations());
  } catch {
    return [];
  }
  const savedBuses = await busModel.find();
  const changedBuses = [];

  for (const currentBus of currentBusData) {
    const matchedBus = await savedBuses.find(
      (savedBus) => savedBus._id === currentBus._id
    );
    if (matchedBus.location !== currentBus.location)
      changedBuses.push(currentBus);
  }

  // Save the changed bus locations to the database
  try {
    await updateBusLocations(changedBuses);
  } catch (err) {
    console.error(err);
  }

  return changedBuses;
};
