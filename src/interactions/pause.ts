import { BaseCommandInteraction } from 'discord.js';
import { CustomClient, QueuePromise } from '../common/interfaces.js';

/**
 * Queue embed with number of songs added
 * @param {CustomClient} Beatscape - Custom client object
 * @param {BaseCommandInteraction} interaction - Interaction object from user request
 */
export default async function stop(
  Beatscape: CustomClient,
  interaction: BaseCommandInteraction
) {
  const musicQueue: QueuePromise = Beatscape.queue.get(interaction.guild.id);
  musicQueue.player.pause();
  interaction.editReply('Song paused. Use `/resume` to start again.');
}
