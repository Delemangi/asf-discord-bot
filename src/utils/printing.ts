import {
  codeBlock,
  inlineCode
} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
import {getChannel} from './client.js';
import {logger} from './logger.js';

export async function longReplyToInteraction (interaction: CommandInteraction, message: string, language: string = ''): Promise<void> {
  logger.debug(`Attempting to reply to interaction ${interaction} with long reply`);

  let reply = false;

  for (const output of splitMessage(message)) {
    if (reply) {
      await interaction.followUp(codeBlock(language, output));
    } else if (interaction.deferred) {
      await interaction.editReply(codeBlock(language, output));
    } else {
      await interaction.reply(codeBlock(language, output));
    }

    reply = true;
  }
}

export async function normalReplyToInteraction (interaction: CommandInteraction, message: string): Promise<void> {
  logger.debug(`Attempting to reply to interaction ${interaction} with normal reply`);

  if (interaction.deferred) {
    await interaction.editReply(message);
  } else {
    await interaction.reply(message);
  }
}

export async function shortReplyToInteraction (interaction: CommandInteraction, message: string): Promise<void> {
  logger.debug(`Attempting to reply to interaction ${interaction} with short reply`);

  if (interaction.deferred) {
    await interaction.editReply(inlineCode(message));
  } else {
    await interaction.reply(inlineCode(message));
  }
}

function *splitMessage (message: string): Generator<string, void> {
  logger.debug(`Splitting message of length ${message.length}`);

  const delimiters: string[] = ['\n', ' ', ','];
  const length = 1_950;
  let output: string;
  let index: number = message.length;
  let split: boolean;
  let currentMessage = message;

  while (currentMessage) {
    if (currentMessage.length > length) {
      split = true;
      for (const char of delimiters) {
        index = currentMessage.slice(0, length).lastIndexOf(char) + 1;

        if (index) {
          split = false;
          break;
        }
      }

      if (split) {
        index = length;
      }

      output = currentMessage.slice(0, Math.max(0, index));
      currentMessage = currentMessage.slice(index);
    } else {
      output = currentMessage;
      currentMessage = '';
    }

    yield output;
  }
}

export async function printLog (channel: string, message: string) {
  logger.debug(`Attempting to print ASF log to channel ${channel}`);

  const chat = getChannel(channel);

  if (chat?.isText()) {
    for (const output of splitMessage(message)) {
      await chat.send(output);
    }
  }
}
