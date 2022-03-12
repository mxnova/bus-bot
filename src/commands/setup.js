const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Create channels/roles in this server for the Bus Bot!'),
  async execute(interaction) {
    await interaction.reply('temporary reply');
  },
};
