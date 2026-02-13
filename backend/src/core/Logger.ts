import { createLogger, transports, format } from "winston";
import { enviornment, logDirectory } from "../secrets";
import path from "path";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

const dir = path.resolve(logDirectory ?? "logs");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const logLevel =
  enviornment === "development" ? "debug" : "warn";

const dailyRotateFile = new DailyRotateFile({
  filename: path.join(dir, "%DATE%-results.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
});

export default createLogger({
  level: logLevel,
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, stack }) =>
          stack
            ? `[${timestamp}] ${level}: ${stack}`
            : `[${timestamp}] ${level}: ${message}`
        )
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false,
});
