require('dotenv').config();

const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const mongoose = require('mongoose');

const scrape = require('./modules/scrape');
const busModel = require('./models/bus');
const { initialiseBusCollection } = require('./modules/updateDatabase');

// Create the bot client instance
// @ts-ignore
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
// @ts-ignore
client.commands = new Collection();
const commandFiles = readdirSync(`${__dirname}/commands`);

for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`);
  // @ts-ignore
  client.commands.set(command.data.name, command);
}

// Connect to the database
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

// Once database connection is established scrape the bus data and update the bus collection with the new data
db.once('open', async () => {
  console.log('Database connection opened');

  try {
    const busData = await scrape();
    console.log('Scrape Complete');

    // Make a mongoose model array out of the bus data array
    const buses = busData.map((busObject) => new busModel(busObject));

    // Push those buses to the database
    await initialiseBusCollection(buses);
  } catch (err) {
    console.error(err);
  }
});

db.on('error', (err) => console.error(err));

client.login(process.env.DISCORD_TOKEN);
