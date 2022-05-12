import { MessageEmbed } from 'discord.js';
import { Song } from '../common/interfaces';

export function makeStreamEmbed(song: Song) {
  const streamEmbed = new MessageEmbed()
    .setTitle(`Now Streaming`)
    .setColor('#c70606')
    .setThumbnail(song.thumbnail)
    .setDescription(song.title)
    .setTimestamp();
  return streamEmbed;
}

export function makeQueueEmbed(songs: Song[]) {
  let queueEmbed: MessageEmbed;
  if (songs.length === 1) {
    queueEmbed = new MessageEmbed()
      .setTitle(`1 Song Added`)
      .setColor('#c70606')
      .setThumbnail(songs[0].thumbnail)
      .setDescription(songs[0].title)
      .setTimestamp();
  }

  if (songs.length > 1) {
    queueEmbed = new MessageEmbed()
      .setTitle(`${songs.length} Songs Added`)
      .setColor('#c70606')
      .setThumbnail(songs[0].thumbnail)
      .setTimestamp();
  }

  return queueEmbed;
}

export function makeErrorEmbed() {
  let errorEmbed = new MessageEmbed()
    .setColor('#fc03fc')
    .setDescription('Error occurred: `please try again`')
    .setTimestamp();
  return errorEmbed;
}
