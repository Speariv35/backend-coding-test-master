const winston = require('winston');

let logger;
const instance = () => logger;
// creates a new Winston Logger
const init = () => {
  logger = new winston.createLogger({
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
};

module.exports = { init, instance };
