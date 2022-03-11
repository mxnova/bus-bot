const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("DM's you with instructions on the Bus Bot's commands!"),
  async execute(interaction) {
    // Temporary help messages for testing
    await interaction.user.send('test help message');
    await interaction.reply('test help message');
  },
};
