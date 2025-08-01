export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface ILogger {
  error(message: string, meta?: any): void
  warn(message: string, meta?: any): void
  info(message: string, meta?: any): void
  debug(message: string, meta?: any): void
}

export class Logger implements ILogger {
  private static instance: Logger
  private logLevel: LogLevel

  private constructor() {
    this.logLevel = process.env.NODE_ENV === "production" ? LogLevel.ERROR : LogLevel.DEBUG
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    if (level <= this.logLevel) {
      const timestamp = new Date().toISOString()
      const logMessage = `[${timestamp}] ${LogLevel[level]}: ${message}`

      if (meta) {
        console.log(logMessage, meta)
      } else {
        console.log(logMessage)
      }
    }
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta)
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta)
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta)
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta)
  }
}
