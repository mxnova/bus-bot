const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const registerCommands = require('../modules/registerCommands');
const busModel = require('../models/bus');
const guildModel = require('../models/guild');

const ReplyEmbed = class extends MessageEmbed {
  constructor(replyProgress) {
    super()
      // @ts-ignore
      .setColor(0xe63312)
      .setTimestamp(Date.now())
      .setTitle('Setup Progress...');

    // Initialise the field name variables with ⚪
    let [rolesIcon, channelIcon, commandsIcon, completeIcon] =
      Array(4).fill('⚪');

    switch (replyProgress) {
      case 'rolesComplete':
        rolesIcon = '🟢';
        channelIcon = '🟡';
        break;

      case 'channelComplete':
        rolesIcon = '🟢';
        channelIcon = '🟢';
        commandsIcon = '🟡';
        break;

      case 'commandsComplete':
        rolesIcon = '🟢';
        channelIcon = '🟢';
        commandsIcon = '🟢';
        completeIcon = '🟡';
        break;

      case 'setupComplete':
        rolesIcon = '🟢';
        channelIcon = '🟢';
        commandsIcon = '🟢';
        completeIcon = '🟢';
        break;

      case 'rolesFailed':
        rolesIcon = '🔴';
        break;

      default:
        rolesIcon = '🟡';
        break;
    }

    this.addFields([
      { name: rolesIcon, value: 'Create Roles!' },
      { name: channelIcon, value: 'Create Channel!' },
      { name: commandsIcon, value: 'Register Commands!' },
      { name: completeIcon, value: 'Complete Setup!' },
    ]);
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription(
      'Create channels/roles/commands in this server for the Bus Bot!'
    ),
  async execute(interaction) {
    // If the user does not have the manage guild permission, return
    if (
      !(await (
        await interaction.guild.members.cache.get(interaction.user.id)
      ).permissions.has('MANAGE_GUILD'))
    ) {
      await interaction.reply(
        'You need the "manage guild" permission to use this command!'
      );
      return;
    }

    // If the database already contains a record for this guild, return
    if (await guildModel.findOne({ _id: interaction.guild.id })) {
      await interaction.reply('Setup already complete!');
      return;
    }

    // Send the initial reply
    await interaction.reply({
      embeds: [new ReplyEmbed()],
    });

    /**
     * Ids of all buses in the Buses collection in the database
     * @type {Array<String>}
     */
    const busIds = (await busModel.find()).map((bus) => bus._id);

    // All roles in the guild named after a bus id
    const duplicateRoles = await (
      await interaction.guild.roles.fetch()
    ).filter((role) => busIds.includes(role.name));

    // Delete all duplicateRoles (an error occurs when the bot doesn't have permissions to delete duplicate bus roles)
    for (const [_, role] of duplicateRoles) {
      try {
        await role.delete();
      } catch (err) {
        if (err.message === 'Missing Permissions') {
          interaction.editReply({
            embeds: [new ReplyEmbed('rolesFailed')],
          });
          interaction.followUp({
            content:
              "Setup failed!\nPlease make sure the bus bot's role is hoisted above any roles that may share a name with a bus!",
            ephemeral: true,
          });
        }
        // Exit setup
        return;
      }
    }

    // Create new bus roles
    for (const busId of busIds) {
      await interaction.guild.roles.create({
        name: busId,
        reason: 'Bus Bot setup',
      });
    }

    // Update the reply
    await interaction.editReply({
      embeds: [new ReplyEmbed('rolesComplete')],
    });

    // Create the bus updates channel and save its id
    const busChannelId = await interaction.guild.channels.create(
      'bus-updates',
      {
        reason: 'Bus Bot setup',
      }
    );

    // Update the reply
    interaction.editReply({
      embeds: [new ReplyEmbed('channelComplete')],
    });

    // An array containing the names of all the clients commands
    const commands = Array.from(await interaction.client.commands.keys());

    // Register the clients commands with the guild
    await registerCommands(interaction.client, interaction.guild, commands);

    // Update the reply
    await interaction.editReply({
      embeds: [new ReplyEmbed('commandsComplete')],
    });

    // An array containing all of the bus roles just created
    const busRoles = await (
      await interaction.guild.roles.fetch()
    ).filter((role) => busIds.includes(role.name));

    // An array containing the bus role data that the mongoose guild object needs
    const busModelRoles = [];
    for (const [_, busRole] of busRoles) {
      busModelRoles.push({
        _id: busRole.id,
        name: busRole.name,
      });
    }

    // Create a mongoose guild object for this guild
    const guild = new guildModel({
      _id: interaction.guild.id,
      busRoles: busModelRoles,
      busChannelId: busChannelId.toString().replace(/\D/g, ''),
    });

    // Push the guild to the Guilds collection in the database
    await guild.save();

    // Update reply
    await interaction.editReply({
      embeds: [new ReplyEmbed('setupComplete')],
    });

    await interaction.followUp('Setup Complete!');
  },
};
