import type { CommandInteraction } from 'discord.js'
import axios from 'axios'
import { get2FAFromMail, getConfirmationFromMail } from './mail'
import { logger } from './logger'
import { strings } from './strings'
import { config } from '../config'

const cases: string[] = [
  "Couldn't find any bot named",
  "This bot doesn't have ASF 2FA enabled!",
  'This bot instance is not connected!'
]

export async function ASFRequest (interaction: CommandInteraction, command: string, args: string): Promise<string> {
  logger.debug(`Processing the ASF request: ${command} ${args}`)

  if (!config.asfChannels.includes(interaction.channelId)) {
    return strings.invalidChannel
  } else {
    if (!interaction.deferred) {
      await interaction.deferReply()
      logger.debug('The interaction has been deferred')
    }

    return axios({
      'method': 'post',
      'url': config.asfAPI,
      'headers': {
        'Content-Type': 'application/json',
        'Authentication': config.asfPassword
      },
      'data': {
        'Command': `${command} ${args}`
      }
    })
      .then((response) => {
        logger.debug('The ASF request succeeded')

        if (response.data.Success !== undefined) {
          return response.data.Result
        } else {
          return strings.malformedResponse
        }
      })
      .catch(error => {
        if (error.response) {
          logger.error(`The ASF request failed: ${error.response.data} | ${error.response.status} | ${error.response.headers}`)

          return strings.badResponse
        } else if (error.request) {
          logger.error(`The ASF request failed: ${error.request}`)

          return strings.requestFailed
        } else {
          logger.error(`The ASF request failed: ${error.message} | ${error.response.data}`)

          return strings.unknownError
        }
      })
  }
}

export async function privilegedASFRequest (interaction: CommandInteraction, command: string, args: string, numExtraArgs: number = 0): Promise<string> {
  logger.debug(`Processing the privileged ASF request: ${command} ${args}`)

  if (!config.asfChannels.includes(interaction.channelId)) {
    return strings.invalidChannel
  } else {
    const [accounts, ...extraArgs] = args.split(' ')

    if (numExtraArgs < extraArgs.length) {
      return strings.tooManyArguments
    }

    const output: string[] = []
    let message: string

    for (const account of accounts.split(',')) {
      if (account === '') {
        continue
      } else if (permissionCheck(interaction, account)) {
        message = await ASFRequest(interaction, command, `${account} ${extraArgs.join(' ')}`.trim())
      } else {
        message = `<${account}> ${strings.noBotPermission}`
      }

      output.push(message)
    }

    return output.join('\n')
  }
}

export async function ASFThenMail (interaction: CommandInteraction, command: string, accounts: string): Promise<string> {
  logger.debug(`Processing ASF or mail request: ${command} ${accounts}`)

  if (!config.asfChannels.includes(interaction.channelId)) {
    return strings.invalidChannel
  } else {
    const output: string[] = []
    const bots: string[] = accounts.split(',')
    const asf: string[] = (await privilegedASFRequest(interaction, command, accounts)).split('\n')

    for (let i = 0; i < bots.length; i++) {
      if (cases.some((line) => asf[i].includes(line))) {
        if (command === '2fa') {
          if (permissionCheck(interaction, bots[i])) {
            output.push(await get2FAFromMail(bots[i]))
          } else {
            output.push(`<${bots[i]}> ${strings.noBotPermission}`)
          }
        } else if (command === '2faok') {
          if (permissionCheck(interaction, bots[i])) {
            output.push(await getConfirmationFromMail(bots[i]))
          } else {
            output.push(`<${bots[i]}> ${strings.noBotPermission}`)
          }
        }
      } else {
        if (command === '2fa') {
          if (permissionCheck(interaction, bots[i])) {
            output.push(asf[i])
          } else {
            output.push(`<${bots[i]}> ${strings.noBotPermission}`)
          }
        } else if (command === '2faok') {
          if (permissionCheck(interaction, bots[i])) {
            output.push(asf[i])
          } else {
            output.push(`<${bots[i]}> ${strings.noBotPermission}`)
          }
        }
      }
    }

    return output.join('\n')
  }
}

export function permissionCheck (interaction: CommandInteraction, account: string = ''): boolean {
  const author: string = interaction.user.id

  return author in config.asfPermissions && (config.asfPermissions[author].includes(account) || config.asfPermissions[author] === 'All')
}
