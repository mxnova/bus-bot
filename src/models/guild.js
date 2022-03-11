const mongoose = require('mongoose');

// Unfinished

const guildSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  busRoles: {
    type: [
      {
        _id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    required: false,
  },
  busChannel: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Guild', guildSchema, 'Guilds');
