const winston = require('winston');

// creates a new Winston Logger
const logger = new winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: './logs/app.log',
      timestamp: true,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ',
        }),
        winston.format.json(),
      ),
    }),
  ],
  exitOnError: false,
});
module.exports = logger;
