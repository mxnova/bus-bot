const { SlashCommandBuilder } = require('@discordjs/builders');
const guildModel = require('../models/guild');

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
    const requestedRole = await interaction.options.getRole('role');

    // If user requested a role other than a known bus role, return
    if (!(await guildModel.findOne({ 'busRoles.name': requestedRole.name }))) {
      await interaction.reply(
        'I can only grant you bus roles! (Roles named after bus numbers!)'
      );
      return;
    }

    // Get the user as a member of the guild
    const user = await interaction.guild.members.cache.get(interaction.user.id);

    // If the user already has the requested role, return
    if (await user.roles.cache.has(requestedRole.id)) {
      await interaction.reply('You already have the requested role!');
      return;
    }

    // Give the user the requested role
    await user.roles.add(requestedRole, 'User requested role');

    // Reply with the role that has been granted
    await interaction.reply(
      `You have been granted the role for bus ${requestedRole.name}!`
    );
  },
};
