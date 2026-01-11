import winston from 'winston';

const logLevel: 'debug' | 'info' =
    process.env.NODE_ENV === 'development' ? 'debug' : 'info';

const logger: winston.Logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            let msg = `${timestamp} [${level}]: ${message}`;
            if (Object.keys(meta).length) {
                msg += ` ${JSON.stringify(meta)}`;
            }
            return msg;
        }),
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
