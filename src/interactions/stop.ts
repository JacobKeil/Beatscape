import { CommandInteraction } from 'discord.js';
import { CustomClient, QueuePromise } from '../common/interfaces.js';

/**
 * Queue embed with number of songs added
 * @param {CustomClient} Beatscape - Custom client object
 * @param {CommandInteraction} interaction - Interaction object from user request
 */
export default async function stop(
  Beatscape: CustomClient,
  interaction: CommandInteraction
) {
  await interaction.deleteReply();

  const musicQueue: QueuePromise = Beatscape.queue.get(interaction.guild.id);

  musicQueue.connection.destroy();
  Beatscape.queue.delete(interaction.guild.id);
}
