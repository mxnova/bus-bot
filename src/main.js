require('dotenv').config();

const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const mongoose = require('mongoose');
const { scheduleJob } = require('node-schedule');
const scrapeBusLocations = require('./modules/scrapeBusLocations');
const busModel = require('./models/bus');
const { initialiseBusCollection } = require('./modules/updateDatabase');
const sendBusUpdates = require('./modules/sendBusUpdates');
const getChangedBuses = require('./modules/getChangedBuses');

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

client.login(process.env.DISCORD_TOKEN);

// Connect to the database
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

// Once database connection is established scrape the bus data and update the bus collection with the new data
db.once('open', async () => {
  console.log('Database connection opened');

  try {
    const busData = await scrapeBusLocations();
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

// Run sendBusUpdates every 5 mins between 3 and 5pm from Monday to Friday from September to July
scheduleJob(
  'dailyUpdates',
  '*/5 15-17 * 1-7,8-12 1-5',
  async () => await sendBusUpdates(client)
);

// Run getChangedBuses at 12:30am from Tuesday to Saturday from September to July
scheduleJob('resetLocations', '30 0 * 1-7,8-12 2-6', async () => {
  await getChangedBuses();
});
