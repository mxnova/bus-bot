const { MessageEmbed } = require('discord.js');

module.exports = class SetupEmbed extends MessageEmbed {
  constructor(replyProgress) {
    super()
      // @ts-ignore
      .setColor(0xe63312)
      .setDescription('(This may take some time...)')
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
