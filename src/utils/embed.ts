import { MessageEmbed, EmbedFooterData } from 'discord.js';
import { Song } from '../common/interfaces';

export function makeStreamEmbed(song: Song) {
  const streamEmbed = new MessageEmbed()
    .setTitle(`Now Streaming`)
    .setColor('#c70606')
    .setThumbnail(song.thumbnail)
    .setDescription(song.title)
    .setFooter({
      text: `[Link to video](${song.url})`,
    })
    .setTimestamp();
  return streamEmbed;
}

export function makeQueueEmbed(songs: Song[]) {
  let queueEmbed: MessageEmbed;
  queueEmbed = new MessageEmbed()
    .setTitle(`${songs.length} Songs Added`)
    .setColor('#c70606')
    .setTimestamp();

  return queueEmbed;
}

export function makeErrorEmbed() {
  let errorEmbed = new MessageEmbed()
    .setColor('#fc03fc')
    .setDescription('Error occurred: `please try again`')
    .setTimestamp();
  return errorEmbed;
}
