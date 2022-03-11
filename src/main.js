require('dotenv').config();

const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const mongoose = require('mongoose');

const scrape = require('./modules/scrape');
const { makeBusModel } = require('./modules/objectsToModels');
const { initialiseBusCollection } = require('./modules/updateDatabase');

// Create the bot client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load event handlers from event files
const eventFiles = readdirSync(`${__dirname}/events`);

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

// Load commands from command files
client.commands = new Collection();
// Commands starting with 'sub' are sub commands used by other commands and should not be imported here
const commandFiles = readdirSync(`${__dirname}/commands`).filter(
  (file) => !file.startsWith('sub')
);

for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Connect to the database
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

// Once database connection is established scrape the bus data and update the bus collection with the new data
db.once('open', async () => {
  console.log('Database connection opened');

  try {
    const busObjects = await scrape();
    console.log('Scrape Complete');

    // Make a mongoose model array out of the bus data array
    const busModels = busObjects.map(makeBusModel);

    // Push those buses to the database
    busModels.every(initialiseBusCollection);
  } catch (err) {
    console.error(err);
  }
});

db.on('error', (err) => console.error(err));

client.login(process.env.DISCORD_TOKEN);
