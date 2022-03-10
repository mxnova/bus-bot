require('dotenv').config();

const { Client, Intents } = require('discord.js');
const mongoose = require('mongoose');

const scrape = require('./modules/scrape');
const { makeBusModel } = require('./modules/objectsToModels');
const { initialiseBusCollection } = require('./modules/updateDatabase');

// Create the bot client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Connect to the database
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

// Once database connection is established scrape the bus data and update the bus collection with the new data
db.once('open', () => {
  console.log('Database connection opened');

  scrape()
    .then((busData) => {
      console.log('Scrape complete');

      // Make mongoose model array out of the bus data array
      const busModels = busData.map(makeBusModel);

      for (const bus of busModels) initialiseBusCollection(bus);
    })
    .catch((err) => console.error(err));
});

db.on('error', (err) => console.error(err));

// Run this code once when the client is ready
client.once('ready', () => console.log(`${client.user.tag} is ready!`));

client.login(process.env.DISCORD_TOKEN);
