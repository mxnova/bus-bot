const { SlashCommandBuilder } = require('@discordjs/builders');
const guildModel = require('../models/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a bus role!')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The bus role you want to remove!')
        .setRequired(true)
    ),
  async execute(interaction) {
    const specifiedRole = await interaction.options.getRole('role');

    // If user specified a role other than a known bus role, return
    if (!(await guildModel.findOne({ 'busRoles.name': specifiedRole.name }))) {
      await interaction.reply(
        'I can only remove bus roles from you! (Roles named after bus numbers!)'
      );
      return;
    }

    // Get the user as a member of the guild
    const user = await interaction.guild.members.cache.get(interaction.user.id);

    // If the user doesn't have the specified role, return
    if (!(await user.roles.cache.has(specifiedRole.id))) {
      await interaction.reply("You don't have the specified role!");
      return;
    }

    // Remove the specified role from the user
    await user.roles.remove(specifiedRole, 'User requested role be removed');

    // Reply with the role that has been removed
    await interaction.reply(
      `The role for bus ${specifiedRole.name} has been removed from you!`
    );
  },
};
