export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class WikipediaAPIError extends AppError {
  constructor(message = "Wikipedia API request failed") {
    super(message, 503)
  }
}

export class QuizGenerationError extends AppError {
  constructor(message = "Failed to generate quiz") {
    super(message, 500)
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400)
  }
}
