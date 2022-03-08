const { Client, Intents } = require('discord.js');
const { token } = require('./config/config.json');
const { scrape } = require('./modules/scrape');

// Create the bot client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Run this code once when the client is ready
client.once('ready', () => {
  console.log(`${client.user.tag} is ready!`);

  // Scrape the bus numbers and locations from the website
  scrape().then(console.log).catch(console.error);
});

client.login(token);
