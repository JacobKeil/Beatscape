import { config } from 'dotenv';
config();

const youtube_key = process.env.YOUTUBE_API_KEY;
const domain = process.env.DOMAIN;
const endpoint_start = `https://www.googleapis.com/youtube/v3`;
import axios from 'axios';
import { decode } from 'html-entities';
import { CommandInteraction } from 'discord.js';
import { CustomClient, Log, Song } from '../common/interfaces';

/**
 * Fetch YouTube data from user request
 * @param {string} url - Desired endpoint URL
 * @returns {Song[]} Array of songs
 */
export async function fetchData(url: string): Promise<Song[]> {
  let videos: Array<Song> = [];
  let video_results: any[] = [];

  try {
    const response = await axios.get(url);
    video_results = response.data.items;

    video_results.forEach((video: any) => {
      videos.push({
        title: decode(video.snippet.title),
        thumbnail: video.snippet.thumbnails.default.url,
        url: `https://www.youtube.com/watch?v=${
          video.snippet.resourceId?.videoId || video.id.videoId || video.id
        }`,
      });
    });
  } catch (err) {
    console.log(err);
  }

  return videos;
}

/**
 * Creates database log of requested song
 * @param {Interaction} interaction - Interaction object from user input
 * @param {Song} song - Song object that was played
 */
export async function createLog(interaction: CommandInteraction, song: Song) {
  let log: Log = {
    discordId: interaction.member.user.id,
    guildId: interaction.guild.id,
    guildName: interaction.guild.name,
    song: song,
    username: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
    date: new Date().toISOString(),
  };

  try {
    const response = await axios.post(`https://${domain}/api/logs`, log);
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

/**
 * Destroys queue object for server
 * @param {CustomClient} Beatscape - DiscordJS client
 * @param {string} guildId - Guild ID from interaction object
 * @param {any} err - Error object
 */
export function endSession(Beatscape: CustomClient, guildId: string, err: any) {
  console.log(err);
  Beatscape.queue.get(guildId).connection.destroy();
  Beatscape.queue.delete(guildId);
}

/**
 * Get avatar for specific user
 * @param {CommandInteraction} interaction - Interaction object
 * @returns {string} Constructed avatar URL
 */
export function getAvatar(interaction: CommandInteraction): string {
  return `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`;
}

/**
 * Get video by user search
 * @param {string} args - Desired endpoint URL
 * @returns {string} Constructed youtube endpoint
 */
export function search(args: string): string {
  return `${endpoint_start}/search?part=snippet&maxResults=1&q=${args}&type=video&key=${youtube_key}`;
}

/**
 * Get video by ID
 * @param {string} id - ID of YouTube video
 * @returns {string} Constructed youtube endpoint
 */
export function getVideoById(id: string): string {
  return `${endpoint_start}/videos?part=snippet&id=${id}&key=${youtube_key}`;
}

/**
 * Get playlist by ID
 * @param {string} id - ID of YouTube playlist
 * @param {string} results - Number of songs to get from playlist
 * @returns {string} Constructed youtube endpoint
 */
export function getPlaylistById(id: string, results: string): string {
  return `${endpoint_start}/playlistItems?part=snippet&maxResults=${results}&playlistId=${id}&type=video&key=${youtube_key}`;
}
