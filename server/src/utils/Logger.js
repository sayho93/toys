import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'
import fs from 'fs'
import Config from 'src/config/Config'

const logDir = 'logs' // logs 디렉토리 하위에 로그 파일 저장
const {combine, timestamp, printf, label} = winston.format

// Define log format
const logFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const options = {
    file: {
        level: 'silly',
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            label({label: Config.app.SERVICE_NAME}),
            logFormat,
            winston.format.colorize()
        ),
        transports: [
            new winstonDaily({
                datePattern: 'YYYY-MM-DD',
                dirname: logDir,
                filename: `%DATE%.log`,
                maxFiles: 30, // 30일치 로그 파일 저장
                zippedArchive: true,
            }),
        ],
    },
    console: {
        level: 'silly',
        format: combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            label({label: Config.app.SERVICE_NAME}),
            logFormat,
            winston.format.colorize()
        ),
        transports: [],
    },
}

const Log = winston.createLogger(options.file).add(new winston.transports.Console(options.console))
export default Log

export const stream = {
    write: message => {
        Log.http(message.substring(0, message.lastIndexOf('\n')))
    },
}
