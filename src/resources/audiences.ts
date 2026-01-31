import type { HttpClient } from '../client.js'
import type {
  ActivityEvent,
  AddSubscriberParams,
  ApiResponse,
  Audience,
  CreateAudienceParams,
  EngagementStats,
  ExportSubscribersParams,
  ImportSubscribersParams,
  ImportSubscribersResult,
  ListActivityParams,
  ListSubscribersParams,
  PaginatedResponse,
  PaginationParams,
  RecalculateEngagementResult,
  Subscriber,
  UpdateAudienceParams,
  UpdateSubscriberParams,
} from '../types.js'

/**
 * Subscriber management within an audience
 */
export class Subscribers {
  constructor(
    private readonly http: HttpClient,
    private readonly audienceId: string
  ) {}

  /**
   * List subscribers in the audience
   *
   * @example
   * ```typescript
   * const { data } = await client.audiences.subscribers('audience_xxxxx').list({
   *   status: 'active',
   * });
   * ```
   */
  async list(params?: ListSubscribersParams): Promise<PaginatedResponse<Subscriber>> {
    return this.http.get<PaginatedResponse<Subscriber>>(
      `/v1/audiences/${this.audienceId}/subscribers`,
      {
        limit: params?.limit,
        cursor: params?.cursor,
        status: params?.status,
        email: params?.email,
      }
    )
  }

  /**
   * Add a subscriber to the audience
   *
   * @example
   * ```typescript
   * const subscriber = await client.audiences.subscribers('audience_xxxxx').add({
   *   email: 'user@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe',
   * });
   * ```
   */
  async add(params: AddSubscriberParams): Promise<Subscriber> {
    const response = await this.http.post<ApiResponse<Subscriber>>(
      `/v1/audiences/${this.audienceId}/subscribers`,
      params
    )
    return response.data
  }

  /**
   * Get a subscriber by ID
   *
   * @example
   * ```typescript
   * const subscriber = await client.audiences.subscribers('audience_xxxxx').get('subscriber_xxxxx');
   * ```
   */
  async get(subscriberId: string): Promise<Subscriber> {
    const response = await this.http.get<ApiResponse<Subscriber>>(
      `/v1/audiences/${this.audienceId}/subscribers/${subscriberId}`
    )
    return response.data
  }

  /**
   * Update a subscriber
   *
   * @example
   * ```typescript
   * const subscriber = await client.audiences.subscribers('audience_xxxxx').update('subscriber_xxxxx', {
   *   firstName: 'Jane',
   * });
   * ```
   */
  async update(subscriberId: string, params: UpdateSubscriberParams): Promise<Subscriber> {
    const response = await this.http.put<ApiResponse<Subscriber>>(
      `/v1/audiences/${this.audienceId}/subscribers/${subscriberId}`,
      params
    )
    return response.data
  }

  /**
   * Remove a subscriber from the audience
   *
   * @example
   * ```typescript
   * await client.audiences.subscribers('audience_xxxxx').remove('subscriber_xxxxx');
   * ```
   */
  async remove(subscriberId: string): Promise<void> {
    await this.http.delete<void>(
      `/v1/audiences/${this.audienceId}/subscribers/${subscriberId}`
    )
  }

  /**
   * Confirm a pending subscriber (double opt-in flow)
   *
   * Use this endpoint after a subscriber clicks their confirmation link.
   * This changes their status from 'pending' to 'active' and sets confirmedAt.
   *
   * @example
   * ```typescript
   * const confirmed = await client.audiences.subscribers('audience_xxxxx').confirm('subscriber_xxxxx');
   * console.log(confirmed.status); // 'active'
   * console.log(confirmed.confirmedAt); // '2024-01-15T10:00:00Z'
   * ```
   */
  async confirm(subscriberId: string): Promise<Subscriber> {
    const response = await this.http.post<ApiResponse<Subscriber>>(
      `/v1/audiences/${this.audienceId}/subscribers/${subscriberId}/confirm`,
      {}
    )
    return response.data
  }

  /**
   * Bulk import subscribers
   *
   * Import subscribers from a JSON array or CSV data string.
   * Duplicates are automatically skipped.
   *
   * @example
   * ```typescript
   * // Import from array
   * const result = await client.audiences.subscribers('audience_xxxxx').import({
   *   subscribers: [
   *     { email: 'user1@example.com', firstName: 'Alice' },
   *     { email: 'user2@example.com', firstName: 'Bob' },
   *   ],
   * });
   *
   * // Import from CSV string
   * const result = await client.audiences.subscribers('audience_xxxxx').import({
   *   csvData: 'email,firstName,lastName\nuser@example.com,John,Doe',
   * });
   * ```
   */
  async import(params: ImportSubscribersParams): Promise<ImportSubscribersResult> {
    return this.http.post<ImportSubscribersResult>(
      `/v1/audiences/${this.audienceId}/subscribers/import`,
      params
    )
  }

  /**
   * Export subscribers as CSV
   *
   * Returns a CSV string of all subscribers in the audience.
   *
   * @example
   * ```typescript
   * const csv = await client.audiences.subscribers('audience_xxxxx').export();
   *
   * // Filter by status
   * const csv = await client.audiences.subscribers('audience_xxxxx').export({ status: 'active' });
   *
   * // Write to file
   * import { writeFileSync } from 'fs';
   * writeFileSync('subscribers.csv', csv);
   * ```
   */
  async export(params?: ExportSubscribersParams): Promise<string> {
    return this.http.get<string>(
      `/v1/audiences/${this.audienceId}/subscribers/export`,
      {
        status: params?.status,
      }
    )
  }

  /**
   * Get subscriber activity timeline
   *
   * Returns a paginated, chronological list of email events for the subscriber.
   *
   * @example
   * ```typescript
   * const { data, hasMore } = await client.audiences
   *   .subscribers('audience_xxxxx')
   *   .activity('subscriber_xxxxx');
   *
   * // Filter by event type
   * const opens = await client.audiences
   *   .subscribers('audience_xxxxx')
   *   .activity('subscriber_xxxxx', { type: 'opened' });
   * ```
   */
  async activity(subscriberId: string, params?: ListActivityParams): Promise<PaginatedResponse<ActivityEvent>> {
    return this.http.get<PaginatedResponse<ActivityEvent>>(
      `/v1/audiences/${this.audienceId}/subscribers/${subscriberId}/activity`,
      {
        limit: params?.limit,
        cursor: params?.cursor,
        type: params?.type,
      }
    )
  }
}

/**
 * Audience and subscriber management
 */
export class Audiences {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new audience
   *
   * @example
   * ```typescript
   * const audience = await client.audiences.create({
   *   name: 'Newsletter Subscribers',
   *   description: 'Users who signed up for the newsletter',
   * });
   * ```
   */
  async create(params: CreateAudienceParams): Promise<Audience> {
    const response = await this.http.post<ApiResponse<Audience>>('/v1/audiences', params)
    return response.data
  }

  /**
   * List all audiences
   *
   * @example
   * ```typescript
   * const { data } = await client.audiences.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Audience>> {
    return this.http.get<PaginatedResponse<Audience>>('/v1/audiences', {
      limit: params?.limit,
      cursor: params?.cursor,
    })
  }

  /**
   * Get a single audience by ID
   *
   * @example
   * ```typescript
   * const audience = await client.audiences.get('audience_xxxxx');
   * ```
   */
  async get(id: string): Promise<Audience> {
    const response = await this.http.get<ApiResponse<Audience>>(`/v1/audiences/${id}`)
    return response.data
  }

  /**
   * Update an audience
   *
   * @example
   * ```typescript
   * const audience = await client.audiences.update('audience_xxxxx', {
   *   name: 'Updated Name',
   * });
   * ```
   */
  async update(id: string, params: UpdateAudienceParams): Promise<Audience> {
    const response = await this.http.put<ApiResponse<Audience>>(`/v1/audiences/${id}`, params)
    return response.data
  }

  /**
   * Delete an audience
   *
   * @example
   * ```typescript
   * await client.audiences.delete('audience_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/audiences/${id}`)
  }

  /**
   * Get a subscribers helper for an audience
   *
   * @example
   * ```typescript
   * const subscribers = client.audiences.subscribers('audience_xxxxx');
   * const { data } = await subscribers.list();
   * await subscribers.add({ email: 'user@example.com' });
   * ```
   */
  subscribers(audienceId: string): Subscribers {
    return new Subscribers(this.http, audienceId)
  }

  /**
   * Recalculate engagement scores for all subscribers in an audience
   *
   * Processes subscribers in batches and updates their engagement score,
   * tier, and scoredAt timestamp.
   *
   * @example
   * ```typescript
   * const result = await client.audiences.recalculateEngagement('audience_xxxxx');
   * console.log(result.processed); // 1500
   * ```
   */
  async recalculateEngagement(audienceId: string): Promise<RecalculateEngagementResult> {
    return this.http.post<RecalculateEngagementResult>(
      `/v1/audiences/${audienceId}/recalculate-engagement`,
      {}
    )
  }

  /**
   * Get engagement statistics for an audience
   *
   * Returns distribution of subscribers by engagement tier and the average score.
   *
   * @example
   * ```typescript
   * const stats = await client.audiences.getEngagementStats('audience_xxxxx');
   * console.log(stats.averageScore); // 67.5
   * console.log(stats.distribution.HIGHLY_ENGAGED); // 250
   * ```
   */
  async getEngagementStats(audienceId: string): Promise<EngagementStats> {
    return this.http.get<EngagementStats>(
      `/v1/audiences/${audienceId}/engagement-stats`
    )
  }
}
