import { sendPrivilegedASFRequest } from "../utils/asf.js";
import { longReplyToInteraction } from "../utils/printing.js";
import { getDescription } from "../utils/strings.js";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const commandName = "transfer";

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName("accounts").setDescription("Accounts").setRequired(true),
  )
  .addIntegerOption((option) =>
    option.setName("app").setDescription("App").setRequired(true),
  )
  .addIntegerOption((option) =>
    option.setName("context").setDescription("Context").setRequired(true),
  )
  .addIntegerOption((option) =>
    option.setName("target").setDescription("Target").setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const accounts = interaction.options.getString("accounts", true);
  const app = interaction.options.getInteger("app", true);
  const context = interaction.options.getInteger("context", true);
  const target = interaction.options.getInteger("target", true);
  const message = await sendPrivilegedASFRequest(
    interaction,
    "transfer^",
    `${accounts} ${app} ${context} ${target}`,
    4,
  );

  await longReplyToInteraction(interaction, message);
};
