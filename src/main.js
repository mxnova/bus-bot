const { Client, Intents } = require('discord.js');
const { token } = require('./config/config.json');

// Create the bot client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Run this code once when the client is ready
client.once('ready', () => {
	console.log(`${client.user.tag} is ready!`);
});

client.login(token);
