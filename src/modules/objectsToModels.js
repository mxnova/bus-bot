const busModel = require('../models/bus');
const guildModel = require('../models/guild');

module.exports = {
  makeBusModel(busObject) {
    return new busModel(busObject);
  },
};
