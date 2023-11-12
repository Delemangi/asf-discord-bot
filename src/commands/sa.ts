import { sendPrivilegedASFRequest } from "../utils/asf.js";
import { longReplyToInteraction } from "../utils/printing.js";
import { getDescription } from "../utils/strings.js";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const commandName = "sa";

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName));

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const message = await sendPrivilegedASFRequest(interaction, commandName, "");

  await longReplyToInteraction(interaction, message);
};
