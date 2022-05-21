import { Guild, Constants } from 'discord.js';
import { BeatscapeClient, QueuePromise } from '../common/interfaces';
import { playSong } from '../interactions/play.js';
// import { guildId } from './config.js';

export function registerCommands(Beatscape: BeatscapeClient) {
  // const guild: Guild = Beatscape.client.guilds.cache.get(guildId);
  let commands: any;
  commands = Beatscape.client.application.commands;

  commands?.create({
    name: 'play',
    description: 'play song from search, link, or playlist.',
    options: [
      {
        name: 'search',
        description: 'search, link, or playlist link.',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING,
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

  Beatscape.client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    await interaction.deferReply();

    const guild = Beatscape.client.guilds.cache.get(interaction.guildId);
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
    const search = options.getString('search');

    if (commandName === 'play') {
      if (search) {
        try {
          await interaction.deleteReply();
          playSong(Beatscape, interaction, search);
          return;
        } catch (err) {
          console.log(err);
        }
      }
    }

    const musicQueue: QueuePromise = Beatscape.queue.get(interaction.guild.id);

    function onDestroy(err: any) {
      console.log(err);
      musicQueue.connection.destroy();
      Beatscape.queue.delete(interaction.guild.id);
    }

    if (commandName == 'skip') {
      try {
        await interaction.deleteReply();
        musicQueue.player.stop();
      } catch (err) {
        onDestroy(err);
      }
    }

    if (commandName === 'stop') {
      try {
        await interaction.deleteReply();
        musicQueue.connection.destroy();
        Beatscape.queue.delete(interaction.guild.id);
      } catch (err) {
        onDestroy(err);
      }
    }

    if (commandName === 'pause') {
      try {
        musicQueue.player.pause();
        interaction.editReply('Song paused. Use `/resume` to start again.');
      } catch (err) {
        onDestroy(err);
      }
    }

    if (commandName === 'resume') {
      try {
        musicQueue.player.unpause();
        interaction.editReply('Song resumed. Use `/pause` to pause again.');
      } catch (err) {
        onDestroy(err);
      }
    }
  });
}
