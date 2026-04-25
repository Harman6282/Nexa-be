"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const secrets_1 = require("../secrets");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const dir = path_1.default.resolve(secrets_1.logDirectory !== null && secrets_1.logDirectory !== void 0 ? secrets_1.logDirectory : "logs");
if (!fs_1.default.existsSync(dir)) {
    fs_1.default.mkdirSync(dir, { recursive: true });
}
const logLevel = secrets_1.enviornment === "development" ? "debug" : "warn";
const dailyRotateFile = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(dir, "%DATE%-results.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json()),
});
exports.default = (0, winston_1.createLogger)({
    level: logLevel,
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.printf(({ timestamp, level, message, stack }) => stack
                ? `[${timestamp}] ${level}: ${stack}`
                : `[${timestamp}] ${level}: ${message}`)),
        }),
        dailyRotateFile,
    ],
    exceptionHandlers: [dailyRotateFile],
    exitOnError: false,
});
