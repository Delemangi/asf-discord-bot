import {
  type ChatInputCommandInteraction,
  ChannelType,
  codeBlock,
  inlineCode
} from 'discord.js';
import {getChannel} from './client.js';
import {logger} from './logger.js';
import {getString} from './strings.js';

export async function longReplyToInteraction (interaction: ChatInputCommandInteraction, message: string, language: string = ''): Promise<void> {
  logger.debug(`Replying to interaction ${interaction.id} with long reply`);

  let reply = false;

  for (let output of splitMessage(message)) {
    if (output === '') {
      logger.warn(`Received an empty response for interaction ${interaction.id}`);

      output = getString('emptyMessage');
    }

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

export async function normalReplyToInteraction (interaction: ChatInputCommandInteraction, message: string): Promise<void> {
  logger.debug(`Replying to interaction ${interaction.id} with normal reply`);

  if (message === '') {
    logger.warn(`Received an empty response for interaction ${interaction.id}`);

    message = getString('emptyMessage');
  }

  if (interaction.deferred) {
    await interaction.editReply(message);
  } else {
    await interaction.reply(message);
  }
}

export async function shortReplyToInteraction (interaction: ChatInputCommandInteraction, message: string): Promise<void> {
  logger.debug(`Replying to interaction ${interaction.id} with short reply`);

  if (message === '') {
    logger.warn(`Received an empty response for interaction ${interaction.id}`);

    message = getString('emptyMessage');
  }

  if (interaction.deferred) {
    await interaction.editReply(inlineCode(message));
  } else {
    await interaction.reply(inlineCode(message));
  }
}

function *splitMessage (message: string): Generator<string, void> {
  logger.debug(`Splitting message of length ${message.length}`);

  if (message === '') {
    yield '';
    return;
  }

  const delimiters = ['\n', ' ', ','];
  const length = 1_950;
  let output: string;
  let index = message.length;
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

export async function printLog (channel: string, message: string): Promise<void> {
  logger.debug(`Printing ASF log to channel ${channel}`);

  const chat = getChannel(channel);

  if (chat?.type === ChannelType.GuildText) {
    for (const output of splitMessage(message)) {
      await chat.send(codeBlock(output));
    }
  }
}
