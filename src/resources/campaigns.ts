import type { HttpClient } from '../client.js'
import type {
  ApiResponse,
  Campaign,
  CampaignLinkStats,
  CloneCampaignOptions,
  CreateCampaignParams,
  ListLinksParams,
  PaginatedResponse,
  PaginationParams,
  ScheduleCampaignParams,
  SendTestParams,
  SendTestResult,
  UpdateCampaignParams,
} from '../types.js'

/**
 * Campaign management
 */
export class Campaigns {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new campaign
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.create({
   *   name: 'December Newsletter',
   *   subject: 'Our December Updates',
   *   from: 'news@example.com',
   *   audienceId: 'audience_xxxxx',
   *   templateId: 'template_xxxxx',
   * });
   * ```
   */
  async create(params: CreateCampaignParams): Promise<Campaign> {
    const response = await this.http.post<ApiResponse<Campaign>>('/v1/campaigns', params)
    return response.data
  }

  /**
   * List all campaigns
   *
   * @example
   * ```typescript
   * const { data } = await client.campaigns.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Campaign>> {
    return this.http.get<PaginatedResponse<Campaign>>('/v1/campaigns', {
      limit: params?.limit,
      cursor: params?.cursor,
    })
  }

  /**
   * Get a single campaign by ID
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.get('campaign_xxxxx');
   * ```
   */
  async get(id: string): Promise<Campaign> {
    const response = await this.http.get<ApiResponse<Campaign>>(`/v1/campaigns/${id}`)
    return response.data
  }

  /**
   * Update a campaign
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.update('campaign_xxxxx', {
   *   subject: 'Updated Subject Line',
   * });
   * ```
   */
  async update(id: string, params: UpdateCampaignParams): Promise<Campaign> {
    const response = await this.http.patch<ApiResponse<Campaign>>(`/v1/campaigns/${id}`, params)
    return response.data
  }

  /**
   * Delete a campaign
   *
   * @example
   * ```typescript
   * await client.campaigns.delete('campaign_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/campaigns/${id}`)
  }

  /**
   * Schedule a campaign for later delivery
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.schedule('campaign_xxxxx', {
   *   scheduledAt: '2024-12-25T09:00:00Z',
   * });
   * ```
   */
  async schedule(id: string, params: ScheduleCampaignParams): Promise<Campaign> {
    const response = await this.http.post<ApiResponse<Campaign>>(
      `/v1/campaigns/${id}/schedule`,
      params
    )
    return response.data
  }

  /**
   * Send a campaign immediately
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.send('campaign_xxxxx');
   * ```
   */
  async send(id: string): Promise<Campaign> {
    const response = await this.http.post<ApiResponse<Campaign>>(`/v1/campaigns/${id}/send`)
    return response.data
  }

  /**
   * Pause a sending campaign
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.pause('campaign_xxxxx');
   * ```
   */
  async pause(id: string): Promise<Campaign> {
    const response = await this.http.post<ApiResponse<Campaign>>(`/v1/campaigns/${id}/pause`)
    return response.data
  }

  /**
   * Resume a paused campaign
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.resume('campaign_xxxxx');
   * ```
   */
  async resume(id: string): Promise<Campaign> {
    const response = await this.http.post<ApiResponse<Campaign>>(`/v1/campaigns/${id}/resume`)
    return response.data
  }

  /**
   * Cancel a scheduled or sending campaign
   *
   * @example
   * ```typescript
   * const campaign = await client.campaigns.cancel('campaign_xxxxx');
   * ```
   */
  async cancel(id: string): Promise<Campaign> {
    const response = await this.http.post<ApiResponse<Campaign>>(`/v1/campaigns/${id}/cancel`)
    return response.data
  }

  /**
   * Send a test/preview of a campaign to 1-5 email addresses
   *
   * @example
   * ```typescript
   * const result = await client.campaigns.sendTest('campaign_xxxxx', {
   *   to: ['test@example.com'],
   * });
   * ```
   */
  async sendTest(id: string, params: SendTestParams): Promise<SendTestResult> {
    return this.http.post<SendTestResult>(`/v1/campaigns/${id}/test`, params)
  }

  /**
   * Clone a campaign as a new draft
   *
   * @example
   * ```typescript
   * const newCampaign = await client.campaigns.clone('campaign_xxxxx', {
   *   includeABTest: true,
   * });
   * ```
   */
  async clone(id: string, options?: CloneCampaignOptions): Promise<Campaign> {
    return this.http.post<Campaign>(`/v1/campaigns/${id}/clone`, options || {})
  }

  /**
   * Get tracked link analytics for a campaign
   *
   * Returns a list of links found in campaign emails with click statistics.
   *
   * @example
   * ```typescript
   * const { data } = await client.campaigns.links('campaign_xxxxx');
   * for (const link of data) {
   *   console.log(`${link.displayUrl}: ${link.uniqueClicks} unique clicks (${link.clickRate}%)`);
   * }
   *
   * // Sort by unique clicks ascending
   * const { data } = await client.campaigns.links('campaign_xxxxx', {
   *   sort: 'uniqueClicks',
   *   order: 'asc',
   * });
   * ```
   */
  async links(campaignId: string, params?: ListLinksParams): Promise<CampaignLinkStats> {
    return this.http.get<CampaignLinkStats>(
      `/v1/campaigns/${campaignId}/links`,
      {
        limit: params?.limit,
        sort: params?.sort,
        order: params?.order,
      }
    )
  }
}
