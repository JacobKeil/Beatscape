import { ApplicationCommandOptionType } from 'discord.js';
import { CustomClient } from '../common/interfaces.js';
import { endSession } from '../utils/helpers.js';
import controls from '../interactions/index.js';

/**
 * Registers all slash commands globally
 * @param {CustomClient} Beatscape - DiscordJS client
 */
export function registerCommands(Beatscape: CustomClient) {
  let commands: any;
  commands = Beatscape.application.commands;

  commands?.create({
    name: 'play',
    description: 'play song from search, link, or playlist.',
    options: [
      {
        name: 'search',
        description: 'search, link, or playlist link.',
        required: true,
        type: ApplicationCommandOptionType.String,
      },
    ],
  });

  commands?.create({
    name: 'skip',
    description: 'skips current song.',
  });

  commands?.create({
    name: 'stop',
    description: 'disconnects bot from voice channel.',
  });

  commands?.create({
    name: 'pause',
    description: 'pauses current audio transmission.',
  });

  commands?.create({
    name: 'resume',
    description: 'resumes current audio transmission.',
  });

  Beatscape.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    await interaction.deferReply();

    const guild = Beatscape.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.deleteReply();
      interaction.channel.send(
        'You need to be in a voice channel to control Beatscape!'
      );
      return;
    }

    const { commandName, options } = interaction;
    const search = options.get('search');

    try {
      switch (commandName) {
        case 'play':
          controls.play(Beatscape, interaction, search.value);
          break;
        case 'stop':
          controls.stop(Beatscape, interaction);
          break;
        case 'skip':
          controls.skip(Beatscape, interaction);
          break;
        case 'pause':
          controls.pause(Beatscape, interaction);
          break;
        case 'resume':
          controls.resume(Beatscape, interaction);
          break;
      }
    } catch (err) {
      endSession(Beatscape, interaction.guild.id, err);
    }
  });
}
