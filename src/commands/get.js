const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription('Get a bus role!')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The bus role you want!')
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log('temp');
  },
};
