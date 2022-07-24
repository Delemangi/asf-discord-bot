import {
  createLogger,
  format,
  transports
} from 'winston';
import {configuration} from './config.js';

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.errors({stack: true}),
        format.colorize({
          colors: {
            debug: 'gray',
            error: 'red',
            http: 'blue',
            info: 'green',
            silly: 'magenta',
            verbose: 'cyan',
            warn: 'yellow'
          }
        }),
        // eslint-disable-next-line object-curly-newline
        format.printf(({level, message, timestamp}) => `${timestamp} - ${level}: ${message}`)
      ),
      handleExceptions: true,
      level: configuration('logLevel')
    }),
    new transports.File({
      filename: 'bot.log',
      format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.errors({stack: true}),
        // eslint-disable-next-line object-curly-newline
        format.printf(({level, message, timestamp}) => `${timestamp} - ${level}: ${message}`)
      ),
      handleExceptions: true,
      level: 'debug',
      options: {flags: 'w'}
    })
  ]
});
