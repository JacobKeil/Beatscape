import { BaseCommandInteraction } from 'discord.js';
import ytldDiscord from 'ytdl-core-discord';
import { CustomClient, Song, User } from '../common/interfaces';
import {
  AudioResource,
  createAudioResource,
  StreamType,
} from '@discordjs/voice';
import { makeStreamEmbed } from '../utils/embed.js';
import { endSession, getAvatar } from '../utils/helpers.js';

export async function playSong(
  Beatscape: CustomClient,
  interaction: BaseCommandInteraction,
  song: Song
) {
  const musicQueue = Beatscape.queue.get(interaction.guild.id);

  if (!song) {
    endSession(Beatscape, interaction.guild.id, 'No song present');
    return;
  }

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

  let user: User = {
    username: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
    avatar: getAvatar(interaction),
  };

  let streamEmbed = makeStreamEmbed(musicQueue.songs[0], user);
  interaction.channel.send({ embeds: [streamEmbed] });
  musicQueue.player.play(stream);
}
