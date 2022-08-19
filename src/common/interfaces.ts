import { registerCommands } from '../utils/commands.js';
import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import {
  Client,
  GatewayIntentBits,
  VoiceBasedChannel,
  TextBasedChannel,
} from 'discord.js';

// DiscordJS client intents
const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessageReactions,
];

/** User object */
export interface User {
  username: string;
  avatar: string;
}

/** Song object from YouTube */
export interface Song {
  title: string;
  thumbnail: string;
  url: string;
}

/** Log object for each song request */
export interface Log {
  discordId: string;
  guildId: string;
  guildName: string;
  song: Song;
  username: string;
  date: string;
}

/** Queue object for each guild */
export interface QueuePromise {
  textChannel: TextBasedChannel;
  voiceChannel: VoiceBasedChannel;
  connection: VoiceConnection | null;
  player: AudioPlayer | null;
  songs: Song[];
  isPaused: Boolean;
}

/** Main client with attached queue map */
export class CustomClient extends Client {
  queue: Map<string, QueuePromise>;
  constructor() {
    super({ intents });
    this.queue = new Map<string, QueuePromise>();
    this.once('ready', () => {
      console.log('Discord bot ready');
      registerCommands(this);
    });
  }
}
