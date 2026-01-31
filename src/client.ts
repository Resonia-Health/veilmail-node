import {
    NetworkError,
    TimeoutError,
    parseApiError,
} from './errors.js'
import { Analytics } from './resources/analytics.js'
import { Audiences } from './resources/audiences.js'
import { AuditLogs } from './resources/audit-logs.js'
import { Campaigns } from './resources/campaigns.js'
import { DedicatedIps } from './resources/dedicated-ips.js'
import { Domains } from './resources/domains.js'
import { Emails } from './resources/emails.js'
import { Feeds } from './resources/feeds.js'
import { Forms } from './resources/forms.js'
import { Inbound } from './resources/inbound.js'
import { Properties } from './resources/properties.js'
import { Sequences } from './resources/sequences.js'
import { Smtp } from './resources/smtp.js'
import { Templates } from './resources/templates.js'
import { Topics } from './resources/topics.js'
import { Validation } from './resources/validation.js'
import { Webhooks } from './resources/webhooks.js'

import type { ApiErrorResponse, VeilMailConfig } from './types.js'

const DEFAULT_BASE_URL = 'https://api.veilmail.xyz'
const DEFAULT_TIMEOUT = 30000

/**
 * HTTP client for making API requests
 * @internal
 */
export class HttpClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly timeout: number

  constructor(config: VeilMailConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required')
    }
    if (!config.apiKey.startsWith('veil_live_') && !config.apiKey.startsWith('veil_test_')) {
      throw new Error('Invalid API key format. API keys should start with veil_live_ or veil_test_')
    }

    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl?.replace(/\/$/, '') ?? DEFAULT_BASE_URL
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT
  }

  /**
   * Make an HTTP request to the API
   */
  async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown
      query?: Record<string, string | number | boolean | undefined>
      headers?: Record<string, string>
    } = {}
  ): Promise<T> {
    const url = new URL(path, this.baseUrl)

    // Add query parameters
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      }
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': '@resonia/veilmail-sdk/0.2.0',
      ...options.headers,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204) {
        return undefined as T
      }

      let body: unknown
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        body = await response.json()
      } else {
        body = await response.text()
      }

      if (!response.ok) {
        throw parseApiError(response, body as ApiErrorResponse | null)
      }

      return body as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError(this.timeout)
        }
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new NetworkError(`Network error: ${error.message}`)
        }
      }

      throw error
    }
  }

  /** GET request */
  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>('GET', path, { query })
  }

  /** POST request */
  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, { body })
  }

  /** PATCH request */
  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, { body })
  }

  /** PUT request */
  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, { body })
  }

  /** DELETE request */
  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }
}

/**
 * The official Veil Mail SDK client
 *
 * @example
 * ```typescript
 * import { VeilMail } from '@resonia/veilmail-sdk';
 *
 * const client = new VeilMail('veil_live_xxxxx');
 *
 * // Send an email
 * const email = await client.emails.send({
 *   from: 'hello@example.com',
 *   to: 'user@example.com',
 *   subject: 'Hello!',
 *   html: '<h1>Welcome!</h1>',
 * });
 * ```
 */
export class VeilMail {
  private readonly http: HttpClient

  /** Email sending and management */
  readonly emails: Emails
  /** Domain verification and management */
  readonly domains: Domains
  /** Email template management */
  readonly templates: Templates
  /** Audience and subscriber management */
  readonly audiences: Audiences
  /** Campaign management */
  readonly campaigns: Campaigns
  /** Automation sequence management */
  readonly sequences: Sequences
  /** RSS feed management */
  readonly feeds: Feeds
  /** Signup form management */
  readonly forms: Forms
  /** Webhook configuration */
  readonly webhooks: Webhooks
  /** Subscription topic management */
  readonly topics: Topics
  /** Contact property management */
  readonly properties: Properties
  /** Geo and device analytics */
  readonly analytics: Analytics
  /** Email address validation */
  readonly validation: Validation
  /** Inbound email rule and message management */
  readonly inbound: Inbound
  /** Dedicated IP and IP pool management */
  readonly dedicatedIps: DedicatedIps
  /** SMTP relay credential management */
  readonly smtp: Smtp
  /** Audit log and compliance management */
  readonly auditLogs: AuditLogs

  /**
   * Create a new Veil Mail client
   * @param apiKeyOrConfig - API key string or configuration object
   */
  constructor(apiKeyOrConfig: string | VeilMailConfig) {
    const config: VeilMailConfig =
      typeof apiKeyOrConfig === 'string'
        ? { apiKey: apiKeyOrConfig }
        : apiKeyOrConfig

    this.http = new HttpClient(config)

    // Initialize resources
    this.emails = new Emails(this.http)
    this.domains = new Domains(this.http)
    this.templates = new Templates(this.http)
    this.audiences = new Audiences(this.http)
    this.campaigns = new Campaigns(this.http)
    this.sequences = new Sequences(this.http)
    this.feeds = new Feeds(this.http)
    this.forms = new Forms(this.http)
    this.webhooks = new Webhooks(this.http)
    this.topics = new Topics(this.http)
    this.properties = new Properties(this.http)
    this.analytics = new Analytics(this.http)
    this.validation = new Validation(this.http)
    this.inbound = new Inbound(this.http)
    this.dedicatedIps = new DedicatedIps(this.http)
    this.smtp = new Smtp(this.http)
    this.auditLogs = new AuditLogs(this.http)
  }
}
