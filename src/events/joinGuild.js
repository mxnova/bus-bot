const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
  name: 'guildCreate',
  once: false,
  async execute(client, guild) {
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    // Register the help and setup commands with the guild that was just joined
    try {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, guild.id),
        {
          body: [
            client.commands.get('help').data.toJSON(),
            client.commands.get('setup').data.toJSON(),
          ],
        }
      );
    } catch (err) {
      console.error(err);
    }
  },
};
