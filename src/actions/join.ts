import {
  AudioPlayerStatus,
  createAudioPlayer,
  DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { CommandInteraction } from 'discord.js';
import { CustomClient, QueuePromise } from '../common/interfaces';
import { playSong } from './play-song.js';

/**
 * Joins the voice channel that the user is in.
 * Adds queue object for the guild into the global
 * queue map
 */
export default async function join(
  Beatscape: CustomClient,
  interaction: CommandInteraction
) {
  const musicQueue: QueuePromise = Beatscape.queue.get(interaction.guild.id);

  const player = createAudioPlayer();
  let connection = joinVoiceChannel({
    channelId: musicQueue.voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild
      .voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
  });

  connection.subscribe(player);

  musicQueue.connection = connection;
  musicQueue.player = player;

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
    } catch (error) {
      connection.destroy();
      Beatscape.queue.delete(interaction.guild.id);
    }
  });

  musicQueue.player.on(AudioPlayerStatus.Idle, () => {
    try {
      musicQueue.songs.shift();

      if (musicQueue.songs.length === 0) {
        musicQueue.connection.destroy();
        Beatscape.queue.delete(interaction.guild.id);
        return;
      }

      playSong(Beatscape, interaction, musicQueue.songs[0]);
    } catch (err) {
      console.log(err);
      connection.destroy();
      Beatscape.queue.delete(interaction.guild.id);
    }
  });
}
