import { BaseCommandInteraction } from 'discord.js';
import ytldDiscord from 'ytdl-core-discord';
import { BeatscapeClient, Song } from '../common/interfaces';
import {
  AudioResource,
  createAudioResource,
  StreamType,
} from '@discordjs/voice';
import { makeStreamEmbed } from '../utils/embed.js';

export async function playOneSong(
  Beatscape: BeatscapeClient,
  interaction: BaseCommandInteraction,
  song: Song
) {
  const musicQueue = Beatscape.queue.get(interaction.guild.id);

  if (!song) {
    musicQueue.connection.destroy();
    Beatscape.queue.delete(interaction.guild.id);
    return;
  }

  try {
    const stream: AudioResource = createAudioResource(
      await ytldDiscord(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      }),
      {
        inputType: StreamType.Opus,
      }
    );

    let streamEmbed = makeStreamEmbed(musicQueue.songs[0]);
    interaction.channel.send({ embeds: [streamEmbed] });
    musicQueue.player.play(stream);
  } catch (err) {
    console.log();
    musicQueue.connection.destroy();
    Beatscape.queue.delete(interaction.guild.id);
  }
}
