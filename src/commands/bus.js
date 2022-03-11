const { SlashCommandBuilder } = require('@discordjs/builders');
const help = require('./subHelp');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bus')
    .setDescription('Root Bus Bot command')
    .addSubcommand((subCommand) => {
      return subCommand
        .setName(help.data.name)
        .setDescription(help.data.description);
    })
    .addSubcommand((subCommand) => {
      return subCommand
        .setName('initialise')
        .setDescription(
          'Initialise all relevant roles and channels in this server for the Bus Bot'
        );
    }),
  async execute(interaction) {
    help.execute(interaction);
  },
};
