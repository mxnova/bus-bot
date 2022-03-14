const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

/**
 * Registers the specified commands of the client to the guild
 * @param {import('discord.js').Client} client Client to register the commands for
 * @param {import('discord.js').Guild} guild Guild to register the commands to
 * @param {Array<String>} commandNames Names of commands to register
 */
module.exports = async (client, guild, commandNames) => {
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

  // Register all commands in the commandNames array to the specified guild
  try {
    await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), {
      body: commandNames.map((commandName) => {
        // @ts-ignore
        return client.commands.get(commandName).data.toJSON();
      }),
    });
  } catch (err) {
    console.error(err);
  }
};
