import {createLogger, format, transports} from 'winston';
import {config} from '../config';

export const logger = createLogger({
    level: config.logLevel,
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.colorize(),
        format.printf(({level, message, label, timestamp}) => `${timestamp} ${label || '-'} ${level}: ${message}`)
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
        new transports.Console(),
        new transports.File({filename: 'bot.log'})
    ]
});
