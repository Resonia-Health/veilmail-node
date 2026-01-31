import type { HttpClient } from '../client.js'
import type {
  ApiResponse,
  CreateWebhookParams,
  PaginatedResponse,
  PaginationParams,
  UpdateWebhookParams,
  Webhook,
  WebhookTestResult,
} from '../types.js'

/**
 * Webhook configuration and management
 */
export class Webhooks {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new webhook
   *
   * @example
   * ```typescript
   * const webhook = await client.webhooks.create({
   *   url: 'https://example.com/webhooks/veilmail',
   *   events: ['email.delivered', 'email.bounced'],
   * });
   * console.log(webhook.secret); // Use this to verify webhook signatures
   * ```
   */
  async create(params: CreateWebhookParams): Promise<Webhook> {
    const response = await this.http.post<ApiResponse<Webhook>>('/v1/webhooks', params)
    return response.data
  }

  /**
   * List all webhooks
   *
   * @example
   * ```typescript
   * const { data } = await client.webhooks.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Webhook>> {
    return this.http.get<PaginatedResponse<Webhook>>('/v1/webhooks', {
      limit: params?.limit,
      cursor: params?.cursor,
    })
  }

  /**
   * Get a single webhook by ID
   *
   * @example
   * ```typescript
   * const webhook = await client.webhooks.get('webhook_xxxxx');
   * ```
   */
  async get(id: string): Promise<Webhook> {
    const response = await this.http.get<ApiResponse<Webhook>>(`/v1/webhooks/${id}`)
    return response.data
  }

  /**
   * Update a webhook
   *
   * @example
   * ```typescript
   * const webhook = await client.webhooks.update('webhook_xxxxx', {
   *   events: ['email.delivered', 'email.bounced', 'email.opened'],
   * });
   * ```
   */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    const response = await this.http.patch<ApiResponse<Webhook>>(`/v1/webhooks/${id}`, params)
    return response.data
  }

  /**
   * Delete a webhook
   *
   * @example
   * ```typescript
   * await client.webhooks.delete('webhook_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/webhooks/${id}`)
  }

  /**
   * Test a webhook by sending a test event
   *
   * @example
   * ```typescript
   * const result = await client.webhooks.test('webhook_xxxxx');
   * if (result.success) {
   *   console.log(`Response time: ${result.responseTime}ms`);
   * }
   * ```
   */
  async test(id: string): Promise<WebhookTestResult> {
    const response = await this.http.post<ApiResponse<WebhookTestResult>>(
      `/v1/webhooks/${id}/test`
    )
    return response.data
  }

  /**
   * Rotate the webhook signing secret
   *
   * @example
   * ```typescript
   * const webhook = await client.webhooks.rotateSecret('webhook_xxxxx');
   * console.log(webhook.secret); // New signing secret
   * ```
   */
  async rotateSecret(id: string): Promise<Webhook> {
    const response = await this.http.post<ApiResponse<Webhook>>(
      `/v1/webhooks/${id}/rotate-secret`
    )
    return response.data
  }
}
