const busModel = require('../models/bus');

module.exports = {
  makeBusModel: function (busObject) {
    return new busModel(busObject);
  },
};
