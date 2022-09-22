import { Container } from 'typedi';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import { LOGGER } from '../constant.js';

export function logWithStack(message: string, error: Error) {
  return `${message}
  Message: ${error.message}
  Stack: ${error.stack ?? '-'}`;
}

export function createLogger() {
  const logDir = 'log';
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const { combine, timestamp, colorize, printf } = winston.format;
  const { Console } = winston.transports;

  const logFormat = ({
    timestamp,
    level,
    message,
  }: winston.Logform.TransformableInfo) => {
    return `[${timestamp}] | ${level.toUpperCase()}: ${message}`;
  };

  const logger = winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      printf(logFormat),
    ),
    transports: [
      new WinstonDaily({
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir,
        filename: '%DATE%.log',
        maxFiles: 14,
      }),
      new WinstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/error',
        filename: '%DATE%.error.log',
        maxFiles: 30,
      }),
    ],
  });

  if (isDevelopment) {
    logger.add(
      new Console({
        format: combine(colorize(), printf(logFormat)),
      }),
    );
  }

  Container.set(LOGGER, logger);
  return logger;
}
