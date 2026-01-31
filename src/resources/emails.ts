import type { HttpClient } from '../client.js'
import type {
  BatchSendEmailResult,
  CancelEmailResult,
  Email,
  EmailLinkStats,
  ListEmailsParams,
  ListLinksParams,
  PaginatedResponse,
  SendEmailParams,
  UpdateEmailParams,
} from '../types.js'

/**
 * Email sending and management
 */
export class Emails {
  constructor(private readonly http: HttpClient) {}

  /**
   * Send an email
   *
   * @example
   * ```typescript
   * const email = await client.emails.send({
   *   from: 'hello@example.com',
   *   to: 'user@example.com',
   *   subject: 'Welcome!',
   *   html: '<h1>Welcome to our platform!</h1>',
   * });
   * ```
   */
  async send(params: SendEmailParams): Promise<Email> {
    return this.http.post<Email>('/v1/emails', params)
  }

  /**
   * Send multiple emails in a single request (max 100)
   *
   * @example
   * ```typescript
   * const result = await client.emails.sendBatch([
   *   { from: 'hello@example.com', to: 'user1@example.com', subject: 'Hi', html: '<p>Hello</p>' },
   *   { from: 'hello@example.com', to: 'user2@example.com', subject: 'Hi', html: '<p>Hello</p>' },
   * ]);
   * console.log(result.successful); // 2
   * ```
   */
  async sendBatch(emails: SendEmailParams[]): Promise<BatchSendEmailResult> {
    return this.http.post<BatchSendEmailResult>('/v1/emails/batch', { emails })
  }

  /**
   * List emails with pagination
   *
   * @example
   * ```typescript
   * const { data, hasMore, nextCursor } = await client.emails.list({
   *   limit: 20,
   *   status: 'delivered',
   * });
   * ```
   */
  async list(params?: ListEmailsParams): Promise<PaginatedResponse<Email>> {
    return this.http.get<PaginatedResponse<Email>>('/v1/emails', {
      limit: params?.limit,
      cursor: params?.cursor,
      status: params?.status,
      tag: params?.tag,
      after: params?.after,
      before: params?.before,
    })
  }

  /**
   * Get a single email by ID
   *
   * @example
   * ```typescript
   * const email = await client.emails.get('email_xxxxx');
   * ```
   */
  async get(id: string): Promise<Email> {
    return this.http.get<Email>(`/v1/emails/${id}`)
  }

  /**
   * Cancel a scheduled email
   *
   * @example
   * ```typescript
   * const result = await client.emails.cancel('email_xxxxx');
   * console.log(result.status); // 'cancelled'
   * ```
   */
  async cancel(id: string): Promise<CancelEmailResult> {
    return this.http.post<CancelEmailResult>(`/v1/emails/${id}/cancel`)
  }

  /**
   * Update a scheduled email (e.g., reschedule)
   *
   * @example
   * ```typescript
   * const email = await client.emails.update('email_xxxxx', {
   *   scheduledFor: '2025-06-01T09:00:00Z',
   * });
   * ```
   */
  async update(id: string, params: UpdateEmailParams): Promise<Email> {
    return this.http.patch<Email>(`/v1/emails/${id}`, params)
  }

  /**
   * Get tracked link analytics for a specific email
   *
   * Returns a list of links found in the email with click statistics.
   *
   * @example
   * ```typescript
   * const { data } = await client.emails.links('email_xxxxx');
   * for (const link of data) {
   *   console.log(`${link.displayUrl}: ${link.totalClicks} clicks`);
   * }
   * ```
   */
  async links(emailId: string, params?: ListLinksParams): Promise<EmailLinkStats> {
    return this.http.get<EmailLinkStats>(
      `/v1/emails/${emailId}/links`,
      {
        limit: params?.limit,
        sort: params?.sort,
        order: params?.order,
      }
    )
  }
}
