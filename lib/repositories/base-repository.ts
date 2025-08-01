import { Logger } from "@/lib/logger/logger"
import { AppError } from "@/lib/errors/custom-errors"

export abstract class BaseRepository {
  protected logger: Logger

  constructor() {
    this.logger = Logger.getInstance()
  }

  protected async handleRequest<T>(request: () => Promise<T>, errorMessage: string): Promise<T> {
    try {
      return await request()
    } catch (error) {
      this.logger.error(errorMessage, error)
      throw new AppError(errorMessage)
    }
  }
}
