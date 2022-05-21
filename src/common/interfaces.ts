import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { Client, VoiceBasedChannel, TextBasedChannel } from 'discord.js';

export interface Song {
  title: string;
  thumbnail: string;
  url: string;
}

export interface Log {
  discordId: string;
  guildId: string;
  guildName: string;
  song: Song;
  username: string;
  date: string;
}

export interface QueuePromise {
  textChannel: TextBasedChannel;
  voiceChannel: VoiceBasedChannel;
  connection: VoiceConnection | null;
  player: AudioPlayer | null;
  songs: Song[];
  isPaused: Boolean;
}

export interface BeatscapeClient {
  client: Client;
  queue: Map<string, QueuePromise>;
}
