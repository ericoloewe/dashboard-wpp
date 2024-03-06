function createLogging() {
  const winston = require('winston');
  const { tmpdir } = require('os');
  const path = require('path');

  const { combine, timestamp, printf, colorize, align } = winston.format;

  const loggingPath = path.join(tmpdir(), './dashboard-gestao/')

  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      timestamp(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: path.join(loggingPath, './error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(loggingPath, './combined.log') }),
    ],
  });

  console.log = logger.info.bind(logger);
  console.error = logger.error.bind(logger);
  console.info = logger.info.bind(logger);
  console.warn = logger.warn.bind(logger);

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp(),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }));
  }

  return logger;
}

if (typeof (module.exports.logger) === 'undefined')
  module.exports.logger = createLogging();
