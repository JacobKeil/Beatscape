import { config } from 'dotenv';
config();

import { CommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core';
import { CustomClient, QueuePromise, Song } from '../common/interfaces.js';
import {
  createLog,
  endSession,
  fetchData,
  getPlaylistById,
  getVideoById,
  search,
} from '../utils/helpers.js';

import { playSong } from '../actions/play-song.js';
import join from '../actions/join.js';
import { makeQueueString } from '../utils/embed.js';

/**
 * Queue embed with number of songs added
 * @param {CustomClient} Beatscape - Custom client object
 * @param {CommandInteraction} interaction - Interaction object from user request
 * @param {string | number | boolean} args - User search arguments
 */
export default async function play(
  Beatscape: CustomClient,
  interaction: CommandInteraction,
  args: string | number | boolean
) {
  await interaction.deleteReply();

  if (!args) {
    return interaction.channel.send(
      'Please add keyword to search or URL for video.'
    );
  }

  const guild = Beatscape.guilds.cache.get(interaction.guildId);
  const member = guild.members.cache.get(interaction.member.user.id);
  const voiceChannel = member.voice.channel;

  let validate = ytdl.validateURL(args.toString());
  let url: string = ``;
  let songs: Song[] = [];

  if (!validate) {
    url = search(args.toString());
  } else if (validate) {
    if (args.toString().includes('list=')) {
      let playlistId: string = args.toString().split('&')[1].split('=')[1];
      url = getPlaylistById(playlistId, '30');
    } else {
      let video_id = ytdl.getURLVideoID(args.toString());
      url = getVideoById(video_id);
    }
  }

  songs = await fetchData(url);
  if (process.env.ENVIRONMENT === 'Production') {
    createLog(interaction, songs[0]);
    console.log('Log created');
  } else {
    console.log('No log created, in development!');
  }
  const musicQueue: QueuePromise = Beatscape.queue.get(interaction.guild.id);

  if (!musicQueue) {
    const queuePromise: QueuePromise = {
      textChannel: interaction.channel,
      voiceChannel: voiceChannel,
      connection: null,
      player: null,
      songs: [],
      isPaused: false,
    };

    Beatscape.queue.set(interaction.guild.id, queuePromise);
    queuePromise.songs.push.apply(queuePromise.songs, songs);

    try {
      await join(Beatscape, interaction);
      playSong(Beatscape, interaction, queuePromise.songs[0]);
    } catch (err) {
      console.log(err);
      endSession(
        Beatscape,
        interaction.guild.id,
        'Error joining voice channel'
      );
      return;
    }
  } else {
    musicQueue.songs.push.apply(musicQueue.songs, songs);
    let message = makeQueueString(songs);
    return interaction.channel.send(message);
  }
}
