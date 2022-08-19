import { EmbedBuilder } from 'discord.js';
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
  const streamEmbed = new EmbedBuilder()
    .setTitle(`Now Streaming`)
    .setColor('#c70606')
    .setThumbnail(song.thumbnail)
    .setDescription(description)
    .setAuthor({
      name: user.username,
      iconURL: user.avatar || defaultIcon,
    });
  return streamEmbed;
}

/**
 * Queue message with number of songs added
 * @param {Song[]} songsAdded - Array of added songs
 * @returns Queue message string
 */
export function makeQueueString(songsAdded: Song[]): string {
  let message = `🎧 \`${songsAdded.length} ${
    songsAdded.length == 1 ? 'song' : 'songs'
  } added to the queue\``;
  return message;
}

/**
 * Error embed with generic message
 * @returns Generic error embed
 */
export function makeErrorEmbed() {
  let errorEmbed = new EmbedBuilder()
    .setColor('#fc03fc')
    .setDescription('Error occurred: `please try again`');
  return errorEmbed;
}
