import { BaseCommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core';

import { BeatscapeClient, QueuePromise, Song } from '../common/interfaces.js';
import { makeQueueEmbed } from '../utils/embed.js';
import {
  fetchData,
  getPlaylistById,
  getVideoById,
  search,
} from '../utils/helpers.js';

import { playOneSong } from '../actions/play-song.js';
import join from '../actions/join.js';

export async function playSong(
  Beatscape: BeatscapeClient,
  interaction: BaseCommandInteraction,
  args: string
) {
  const guild = Beatscape.client.guilds.cache.get(interaction.guildId);
  const member = guild.members.cache.get(interaction.member.user.id);
  const voiceChannel = member.voice.channel;

  let validate = ytdl.validateURL(args);
  let url: string = ``;
  let songs: Song[] = [];

  if (!args) {
    return interaction.channel.send(
      'Please add keyword to search or URL for video.'
    );
  }

  if (!voiceChannel) {
    return interaction.channel.send(
      'You need to be in a voice channel to play music!'
    );
  }

  if (!validate) {
    url = search(args);
  } else if (validate) {
    if (args.includes('list=')) {
      let playlistId: string = args.split('&')[1].split('=')[1];
      url = getPlaylistById(playlistId, '30');
    } else {
      let video_id = ytdl.getURLVideoID(args);
      url = getVideoById(video_id);
    }
  }

  songs = await fetchData(url);
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
      playOneSong(Beatscape, interaction, queuePromise.songs[0]);
    } catch (err) {
      console.log(err);
      queuePromise.connection.destroy();
      Beatscape.queue.delete(interaction.guild.id);
      return;
    }
  } else {
    musicQueue.songs.push.apply(musicQueue.songs, songs);
    let queueEmbed = makeQueueEmbed(songs);
    return interaction.channel.send({ embeds: [queueEmbed] });
  }
}
