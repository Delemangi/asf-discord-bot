import type {
  CommandInteraction,
  Channel
} from 'discord.js';
import {logger} from './logger';

export async function longReplyToInteraction (interaction: CommandInteraction, message: string, language: string = ''): Promise<void> {
  logger.debug(`Attempting to reply to interaction ${interaction}`);

  let reply: boolean = false;

  for (const output of splitMessage(message, language)) {
    if (reply) {
      await interaction.followUp(output);
    } else if (interaction.deferred) {
      await interaction.editReply(output);
    } else {
      await interaction.reply(output);
    }

    reply = true;
  }
}

export async function shortReplyToInteraction (interaction: CommandInteraction, message: string): Promise<void> {
  logger.debug(`Attempting to reply to interaction ${interaction}`);

  if (interaction.deferred) {
    await interaction.editReply(`\`${message}\``);
  } else {
    await interaction.reply(`\`${message}\``);
  }
}

export async function normalReplyToInteraction (interaction: CommandInteraction, message: string): Promise<void> {
  logger.debug(`Attempting to reply to interaction ${interaction}`);

  if (interaction.deferred) {
    await interaction.editReply(message);
  } else {
    await interaction.reply(message);
  }
}

export async function printLog (channel: Channel, message: string, language: string = '') {
  logger.debug(`Attempting to print log to channel ${channel.id}`);

  if (channel.isText()) {
    for (const output of splitMessage(message, language)) {
      await channel.send(`${output}`);
    }
  }
}

function *splitMessage (message: string, language: string = ''): Generator<string, void> {
  logger.debug(`Splitting message of length ${message.length}`);

  const delimiters: string[] = ['\n', ' ', ','];
  const length: number = 1_900;
  let output: string;
  let index: number = message.length;
  let split: boolean;

  while (message) {
    if (message.length > length) {
      split = true;
      for (const char of delimiters) {
        index = message.slice(0, length).lastIndexOf(char) + 1;

        if (index) {
          split = false;
          break;
        }
      }

      if (split) {
        index = length;
      }

      output = `\`\`\`${language}\n${message.slice(0, Math.max(0, index))}\`\`\``;
      message = message.slice(index);
    } else {
      output = `\`\`\`${language}\n${message}\`\`\``;
      message = '';
    }

    yield output;
  }
}
