import {
  type ChatInputCommandInteraction,
  codeBlock,
  inlineCode,
} from 'discord.js';

import { getChannel } from './client.js';
import { logger } from './logger.js';
import { getString } from './strings.js';

const delimiters = ['\n', ' ', ','];
const maxMessageLength = 1_950;

const findSplitIndex = (text: string) => {
  for (const delimiter of delimiters) {
    const index = text.slice(0, maxMessageLength).lastIndexOf(delimiter) + 1;

    if (index) {
      return index;
    }
  }

  return maxMessageLength;
};

const splitMessage = function* (message: string) {
  if (message === '') {
    yield '';
    return;
  }

  let output: string;
  let currentMessage = message;

  while (currentMessage) {
    if (currentMessage.length > maxMessageLength) {
      const index = findSplitIndex(currentMessage);

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
  language = '',
) => {
  let reply = false;

  for (const output of splitMessage(message)) {
    const code = codeBlock(
      language,
      output.length === 0 ? getString('emptyMessage') : output,
    );

    if (reply) {
      await interaction.followUp(code);
    } else if (interaction.deferred) {
      await interaction.editReply(code);
    } else {
      await interaction.reply(code);
    }

    reply = true;
  }
};

export const normalReplyToInteraction = async (
  interaction: ChatInputCommandInteraction,
  message: string,
) => {
  const text = message === '' ? getString('emptyMessage') : message;

  if (message === '') {
    logger.warn(`Received an empty response for interaction ${interaction.id}`);
  }

  await (interaction.deferred
    ? interaction.editReply(text)
    : interaction.reply(text));
};

export const shortReplyToInteraction = async (
  interaction: ChatInputCommandInteraction,
  message: string,
) => {
  const text = message === '' ? getString('emptyMessage') : message;

  if (message === '') {
    logger.warn(`Received an empty response for interaction ${interaction.id}`);
  }

  await (interaction.deferred
    ? interaction.editReply(inlineCode(text))
    : interaction.reply(inlineCode(text)));
};

export const printLog = async (channel: string, message: string) => {
  const chat = getChannel(channel);

  if (!chat?.isSendable()) {
    return;
  }

  for (const output of splitMessage(message)) {
    await chat.send(codeBlock(output));
  }
};
