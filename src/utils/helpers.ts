import { config } from 'dotenv';
config();

const youtube_key = process.env.YOUTUBE_API_KEY;
const domain = process.env.DOMAIN;
const endpoint_start = `https://www.googleapis.com/youtube/v3`;
import axios from 'axios';
import { decode } from 'html-entities';
import { Log, Song } from '../common/interfaces';
import { Interaction } from 'discord.js';

export async function fetchData(url: string) {
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

export async function createLog(interaction: Interaction, song: Song) {
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
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

export function search(args: string) {
  return `${endpoint_start}/search?part=snippet&maxResults=1&q=${args}&type=video&key=${youtube_key}`;
}

export function getVideoById(id: string) {
  return `${endpoint_start}/videos?part=snippet&id=${id}&key=${youtube_key}`;
}

export function getPlaylistById(id: string, results: string) {
  return `${endpoint_start}/playlistItems?part=snippet&maxResults=${results}&playlistId=${id}&type=video&key=${youtube_key}`;
}
