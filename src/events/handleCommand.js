module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(client, interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        content: 'There was an error executing the command',
        ephemeral: true,
      };
      // Some failed commands may have already replied to the interaction
      try {
        await interaction.reply(errorMessage);
      } catch {
        interaction.followUp(errorMessage);
      }
    }
  },
};
