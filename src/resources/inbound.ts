import type { HttpClient } from '../client.js'
import type {
  CreateInboundRuleParams,
  InboundEmail,
  InboundRule,
  ListInboundEmailsParams,
  PaginatedResponse,
  UpdateInboundRuleParams,
} from '../types.js'

/**
 * Inbound email rule and message management
 */
export class Inbound {
  constructor(private readonly http: HttpClient) {}

  // =========================================================================
  // Rules
  // =========================================================================

  /**
   * List all inbound rules
   *
   * @example
   * ```typescript
   * const { data } = await client.inbound.listRules();
   * for (const rule of data) {
   *   console.log(`${rule.matchPattern} on ${rule.domain} -> ${rule.action}`);
   * }
   * ```
   */
  async listRules(): Promise<{ data: InboundRule[] }> {
    return this.http.get<{ data: InboundRule[] }>('/v1/inbound/rules')
  }

  /**
   * Create an inbound rule
   *
   * @example
   * ```typescript
   * const rule = await client.inbound.createRule({
   *   domainId: 'domain_xxxxx',
   *   matchPattern: 'support@',
   *   forwardTo: 'https://example.com/webhook/inbound',
   *   action: 'store_and_webhook',
   * });
   * console.log(rule.mxRecord); // MX record to configure
   * ```
   */
  async createRule(params: CreateInboundRuleParams): Promise<InboundRule> {
    return this.http.post<InboundRule>('/v1/inbound/rules', params)
  }

  /**
   * Get an inbound rule by ID
   *
   * @example
   * ```typescript
   * const rule = await client.inbound.getRule('rule_xxxxx');
   * ```
   */
  async getRule(id: string): Promise<InboundRule> {
    return this.http.get<InboundRule>(`/v1/inbound/rules/${id}`)
  }

  /**
   * Update an inbound rule
   *
   * @example
   * ```typescript
   * const rule = await client.inbound.updateRule('rule_xxxxx', {
   *   matchPattern: '*',
   *   enabled: true,
   * });
   * ```
   */
  async updateRule(id: string, params: UpdateInboundRuleParams): Promise<InboundRule> {
    return this.http.patch<InboundRule>(`/v1/inbound/rules/${id}`, params)
  }

  /**
   * Delete an inbound rule
   *
   * @example
   * ```typescript
   * await client.inbound.deleteRule('rule_xxxxx');
   * ```
   */
  async deleteRule(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/inbound/rules/${id}`)
  }

  // =========================================================================
  // Emails
  // =========================================================================

  /**
   * List received inbound emails
   *
   * @example
   * ```typescript
   * const { data } = await client.inbound.listEmails({
   *   status: 'received',
   *   limit: 50,
   * });
   * ```
   */
  async listEmails(params?: ListInboundEmailsParams): Promise<PaginatedResponse<InboundEmail>> {
    return this.http.get<PaginatedResponse<InboundEmail>>('/v1/inbound/emails', {
      limit: params?.limit,
      cursor: params?.cursor,
      ruleId: params?.ruleId,
      from: params?.from,
      to: params?.to,
      status: params?.status,
    })
  }

  /**
   * Get a received inbound email with full body and headers
   *
   * @example
   * ```typescript
   * const email = await client.inbound.getEmail('inbound_xxxxx');
   * console.log(email.from, email.subject);
   * console.log(email.textBody);
   * ```
   */
  async getEmail(id: string): Promise<InboundEmail> {
    return this.http.get<InboundEmail>(`/v1/inbound/emails/${id}`)
  }

  /**
   * Delete a received inbound email
   *
   * @example
   * ```typescript
   * await client.inbound.deleteEmail('inbound_xxxxx');
   * ```
   */
  async deleteEmail(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/inbound/emails/${id}`)
  }
}
