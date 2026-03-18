import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { sendASFOrMailRequest, sendPrivilegedASFRequest } from './asf.js';
import { longReplyToInteraction } from './printing.js';
import { getDescription } from './strings.js';

type RequestType = 'asf-or-mail' | 'privileged';

export const createSimpleASFCommand = (
  commandName: string,
  requestType: RequestType,
) => {
  const data = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(getDescription(commandName))
    .addStringOption((option) =>
      option.setName('accounts').setDescription('Accounts').setRequired(true),
    );

  const execute = async (interaction: ChatInputCommandInteraction) => {
    const accounts = interaction.options.getString('accounts', true);
    const message =
      requestType === 'asf-or-mail'
        ? await sendASFOrMailRequest(interaction, commandName, accounts)
        : await sendPrivilegedASFRequest(interaction, commandName, {
            args: accounts,
          });

    await longReplyToInteraction(interaction, message);
  };

  return { data, execute };
};
