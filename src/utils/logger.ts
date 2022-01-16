import {
  createLogger,
  format,
  transports
} from 'winston';
import {config} from '../config';

export const logger = createLogger({
  defaultMeta: {service: 'user-service'},
  format: format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.colorize(),
    format.printf(({level, message, label, timestamp}) => `${timestamp} ${label || '-'} ${level}: ${message}`)
  ),
  level: config.logLevel,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'bot.log',
      level: 'debug'
    })
  ]
});
