import type { ApiErrorResponse } from './types.js'

/**
 * Base error class for all Veil Mail SDK errors
 */
export class VeilMailError extends Error {
  /** Error code */
  readonly code: string
  /** HTTP status code (if applicable) */
  readonly status?: number
  /** Additional error details */
  readonly details?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    status?: number,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'VeilMailError'
    this.code = code
    this.status = status
    this.details = details

    // Maintains proper stack trace for where our error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VeilMailError)
    }
  }
}

/**
 * Error thrown when authentication fails (401)
 */
export class AuthenticationError extends VeilMailError {
  constructor(message = 'Invalid API key') {
    super(message, 'authentication_error', 401)
    this.name = 'AuthenticationError'
  }
}

/**
 * Error thrown when the request is forbidden (403)
 */
export class ForbiddenError extends VeilMailError {
  constructor(message = 'Access denied') {
    super(message, 'forbidden', 403)
    this.name = 'ForbiddenError'
  }
}

/**
 * Error thrown when a resource is not found (404)
 */
export class NotFoundError extends VeilMailError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`
    super(message, 'not_found', 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Error thrown when request validation fails (400)
 */
export class ValidationError extends VeilMailError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'validation_error', 400, details)
    this.name = 'ValidationError'
  }
}

/**
 * Error thrown when PII is detected and blocking is enabled
 */
export class PiiDetectedError extends VeilMailError {
  /** Types of PII detected */
  readonly piiTypes: string[]

  constructor(message: string, piiTypes: string[]) {
    super(message, 'pii_detected', 422, { piiTypes })
    this.name = 'PiiDetectedError'
    this.piiTypes = piiTypes
  }
}

/**
 * Error thrown when rate limit is exceeded (429)
 */
export class RateLimitError extends VeilMailError {
  /** Time until rate limit resets (in seconds) */
  readonly retryAfter?: number

  constructor(message = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'rate_limit', 429, retryAfter ? { retryAfter } : undefined)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

/**
 * Error thrown when the API returns a server error (5xx)
 */
export class ServerError extends VeilMailError {
  constructor(message = 'Internal server error', status = 500) {
    super(message, 'server_error', status)
    this.name = 'ServerError'
  }
}

/**
 * Error thrown when a request times out
 */
export class TimeoutError extends VeilMailError {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`, 'timeout')
    this.name = 'TimeoutError'
  }
}

/**
 * Error thrown for network-related issues
 */
export class NetworkError extends VeilMailError {
  constructor(message: string) {
    super(message, 'network_error')
    this.name = 'NetworkError'
  }
}

/**
 * Parse an API error response and return the appropriate error class
 */
export function parseApiError(
  response: Response,
  body: ApiErrorResponse | null
): VeilMailError {
  const status = response.status
  const message = body?.error?.message ?? response.statusText
  const code = body?.error?.code ?? 'unknown_error'
  const details = body?.error?.details

  switch (status) {
    case 401:
      return new AuthenticationError(message)
    case 403:
      return new ForbiddenError(message)
    case 404:
      return new NotFoundError('Resource', undefined)
    case 422:
      if (code === 'pii_detected' && details?.piiTypes) {
        return new PiiDetectedError(message, details.piiTypes as string[])
      }
      return new ValidationError(message, details)
    case 429: {
      const retryAfter = response.headers.get('Retry-After')
      return new RateLimitError(message, retryAfter ? parseInt(retryAfter, 10) : undefined)
    }
    default:
      if (status >= 500) {
        return new ServerError(message, status)
      }
      return new VeilMailError(message, code, status, details)
  }
}
