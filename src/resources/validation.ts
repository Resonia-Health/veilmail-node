import type { HttpClient } from '../client.js'
import type { EmailValidationResult, BatchEmailValidationResult } from '../types.js'

/**
 * Email validation
 *
 * Validate email addresses for syntax, MX records, disposable domains,
 * role addresses, and free provider detection.
 */
export class Validation {
  constructor(private readonly http: HttpClient) {}

  /**
   * Validate a single email address
   *
   * @example
   * ```typescript
   * const result = await client.validation.validate('user@example.com');
   * console.log(result.verdict); // 'valid' | 'risky' | 'invalid'
   * console.log(result.score);   // 0.0 to 1.0
   * ```
   */
  async validate(email: string): Promise<EmailValidationResult> {
    return this.http.post<EmailValidationResult>('/v1/emails/validate', { email })
  }

  /**
   * Validate multiple email addresses (max 100)
   *
   * @example
   * ```typescript
   * const { results } = await client.validation.validateBatch([
   *   'user1@example.com',
   *   'user2@gmail.com',
   *   'admin@tempmail.com',
   * ]);
   * for (const result of results) {
   *   console.log(`${result.email}: ${result.verdict} (${result.score})`);
   * }
   * ```
   */
  async validateBatch(emails: string[]): Promise<BatchEmailValidationResult> {
    return this.http.post<BatchEmailValidationResult>('/v1/emails/validate/batch', { emails })
  }
}
