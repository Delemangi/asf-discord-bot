import { type Command } from "../types/Command.js";
import { Collection } from "discord.js";
import { readdirSync } from "node:fs";

const commands = new Collection<string, Command>();

const refreshCommands = async () => {
  commands.clear();

  for (const cmd of readdirSync("./dist/commands").filter((file) =>
    file.endsWith(".js"),
  )) {
    const command: Command = await import(`../commands/${cmd}`);
    commands.set(command.data.name, command);
  }
};

export const getCommand = async (command: string) => {
  if (commands.entries.length === 0) {
    await refreshCommands();
  }

  return commands.get(command);
};

export const getCommands = async () => {
  if (commands.entries.length === 0) {
    await refreshCommands();
  }

  return commands;
};
