import { sendASFRequest } from "../utils/asf.js";
import { longReplyToInteraction } from "../utils/printing.js";
import { getDescription } from "../utils/strings.js";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const commandName = "oa";
const cases: string[] = [
  "Not owned yet",
  "gamesOwned is empty",
  "This bot instance is not connected!",
  "bots already own game",
];

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName("game").setDescription("Game").setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const game = interaction.options.getString("game", true);
  const output = await sendASFRequest(interaction, commandName, game);
  const message = output
    .split("\n")
    .filter(
      (line) =>
        cases.every((value) => !line.includes(value)) &&
        line.includes("|") &&
        line.length > 1,
    );

  message.push(
    `<ASF> Found ${message.length > 0 ? message.length : "no"} matches.`,
  );

  await longReplyToInteraction(interaction, message.join("\n"));
};
