const registerCommands = require('../modules/registerCommands');

module.exports = {
  name: 'guildCreate',
  once: false,
  async execute(client, guild) {
    // Register the help and setup commands with the guild that was just joined
    try {
      await registerCommands(client, guild, ['help', 'setup']);
    } catch (err) {
      console.error(err);
    }
  },
};
