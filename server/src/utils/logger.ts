import pino from "pino";

const logger = pino({
  level: "info", // Default log level
  transport: {
    target: "pino-pretty", // Pretty-print logs for development
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z", // Adds timestamp
      ignore: "pid,hostname", // Hides unnecessary fields
    },
  },
});

export default logger;
