import { MessageEmbed } from 'discord.js';
import { Song, User } from '../common/interfaces';

const defaultIcon = 'https://cdn.discordapp.com/embed/avatars/0.png';

/**
 * Stream embed tailored to a specific song
 * @param {Song} song - A single Song object
 * @param {User} user - User information object
 * @returns Stream embed with song information
 */
export function makeStreamEmbed(song: Song, user: User) {
  let description = `
    ${song.title}
    [Link to video](${song.url})
  `;
  const streamEmbed = new MessageEmbed()
    .setTitle(`Now Streaming`)
    .setColor('#c70606')
    .setThumbnail(song.thumbnail)
    .setDescription(description)
    .setAuthor({
      name: user.username,
      iconURL: user.avatar || defaultIcon,
    })
    .setTimestamp();
  return streamEmbed;
}

/**
 * Queue embed with number of songs added
 * @param {Song[]} songs - An array of Song objects
 * @returns Queue embed with number of songs added
 */
export function makeQueueEmbed(songs: Song[]) {
  let queueEmbed: MessageEmbed;
  queueEmbed = new MessageEmbed()
    .setTitle(`${songs.length} Songs Added`)
    .setColor('#c70606')
    .setTimestamp();

  return queueEmbed;
}

/**
 * Error embed with generic message
 * @returns Generic error embed
 */
export function makeErrorEmbed() {
  let errorEmbed = new MessageEmbed()
    .setColor('#fc03fc')
    .setDescription('Error occurred: `please try again`')
    .setTimestamp();
  return errorEmbed;
}
