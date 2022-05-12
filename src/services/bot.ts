import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
config();

import { BeatscapeClient } from '../common/interfaces';
import { registerCommands } from '../utils/commands.js';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

let Beatscape: BeatscapeClient = {
  client: client,
  queue: new Map(),
};

Beatscape.client.on('ready', () => {
  console.log('Discord bot ready');
  registerCommands(Beatscape);
});

Beatscape.client.login(process.env.BOT_TOKEN);
