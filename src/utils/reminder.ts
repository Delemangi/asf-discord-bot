import type { CommandInteraction } from 'discord.js'
import { readFileSync, writeFileSync } from 'fs'

let reminders: Buffer = []

function loadReminders () {
  reminders = readFileSync('./data/reminders.json', { 'flag': 'a+' })
}

export function saveReminder (interaction: CommandInteraction) {
  writeFileSync('./data/reminders.json', JSON.stringify(interaction), { 'flag': 'a+' })
}
