const winston = require ('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Configure Log Rotation
const logger = winston.createLogger({
    level: 'debug',  // Minimum level to log (info and above)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Log to the console
        new winston.transports.Console(),
        
        // Log to a file (logs/app.log)
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '3d'  // Keep logs for 3 days
        })
    ]
  });
  
  module.exports = logger;