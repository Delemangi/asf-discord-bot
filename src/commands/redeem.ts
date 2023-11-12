import { sendPrivilegedASFRequest } from "../utils/asf.js";
import { longReplyToInteraction } from "../utils/printing.js";
import { getDescription } from "../utils/strings.js";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const commandName = "redeem";

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName("accounts").setDescription("Accounts").setRequired(true),
  )
  .addStringOption((option) =>
    option.setName("keys").setDescription("Keys").setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const accounts = interaction.options.getString("accounts", true);
  const keys = interaction.options.getString("keys", true);
  const message = await sendPrivilegedASFRequest(
    interaction,
    commandName,
    `${accounts} ${keys}`,
    2,
  );

  await longReplyToInteraction(interaction, message);
};
