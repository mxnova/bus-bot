const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Bus', busSchema, 'Buses');
