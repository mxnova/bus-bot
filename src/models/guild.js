const mongoose = require('mongoose');

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
    required: true,
  },
  busChannelId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Guild', guildSchema, 'Guilds');
