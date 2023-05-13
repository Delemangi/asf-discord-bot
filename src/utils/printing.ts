import { getChannel } from './client.js';
import { logger } from './logger.js';
import { getString } from './strings.js';
import {
  type ChatInputCommandInteraction,
  codeBlock,
  inlineCode,
} from 'discord.js';

const splitMessage = function* (message: string) {
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
};

export const longReplyToInteraction = async (
  interaction: ChatInputCommandInteraction,
  message: string,
  language: string = '',
) => {
  let reply = false;

  for (let output of splitMessage(message)) {
    if (output === '') {
      logger.warn(
        `Received an empty response for interaction ${interaction.id}`,
      );

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
};

export const normalReplyToInteraction = async (
  interaction: ChatInputCommandInteraction,
  message: string,
) => {
  if (message === '') {
    logger.warn(`Received an empty response for interaction ${interaction.id}`);

    // eslint-disable-next-line no-param-reassign
    message = getString('emptyMessage');
  }

  if (interaction.deferred) {
    await interaction.editReply(message);
  } else {
    await interaction.reply(message);
  }
};

export const shortReplyToInteraction = async (
  interaction: ChatInputCommandInteraction,
  message: string,
) => {
  if (message === '') {
    logger.warn(`Received an empty response for interaction ${interaction.id}`);

    // eslint-disable-next-line no-param-reassign
    message = getString('emptyMessage');
  }

  if (interaction.deferred) {
    await interaction.editReply(inlineCode(message));
  } else {
    await interaction.reply(inlineCode(message));
  }
};

export const printLog = async (channel: string, message: string) => {
  const chat = getChannel(channel);

  if (chat?.isTextBased()) {
    for (const output of splitMessage(message)) {
      await chat.send(codeBlock(output));
    }
  }
};
