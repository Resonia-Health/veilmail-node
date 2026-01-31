import type { HttpClient } from '../client.js'
import type {
  CreateRssFeedParams,
  PaginatedResponse,
  PaginationParams,
  RssFeed,
  RssFeedItem,
  UpdateRssFeedParams,
} from '../types.js'

/**
 * RSS Feed management
 */
export class Feeds {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new RSS feed
   *
   * @example
   * ```typescript
   * const feed = await client.feeds.create({
   *   name: 'Company Blog',
   *   url: 'https://blog.example.com/feed.xml',
   *   audienceId: 'audience_xxxxx',
   *   pollInterval: 'daily',
   *   mode: 'single',
   * });
   * ```
   */
  async create(params: CreateRssFeedParams): Promise<RssFeed> {
    return this.http.post<RssFeed>('/v1/feeds', params)
  }

  /**
   * List all RSS feeds
   *
   * @example
   * ```typescript
   * const { data } = await client.feeds.list();
   * ```
   */
  async list(): Promise<{ data: RssFeed[] }> {
    return this.http.get<{ data: RssFeed[] }>('/v1/feeds')
  }

  /**
   * Get a single feed by ID (includes recent items)
   *
   * @example
   * ```typescript
   * const feed = await client.feeds.get('feed_xxxxx');
   * ```
   */
  async get(id: string): Promise<RssFeed & { recentItems: RssFeedItem[] }> {
    return this.http.get<RssFeed & { recentItems: RssFeedItem[] }>(`/v1/feeds/${id}`)
  }

  /**
   * Update a feed
   *
   * @example
   * ```typescript
   * const feed = await client.feeds.update('feed_xxxxx', {
   *   pollInterval: 'hourly',
   * });
   * ```
   */
  async update(id: string, params: UpdateRssFeedParams): Promise<RssFeed> {
    return this.http.put<RssFeed>(`/v1/feeds/${id}`, params)
  }

  /**
   * Delete a feed and all its items
   *
   * @example
   * ```typescript
   * await client.feeds.delete('feed_xxxxx');
   * ```
   */
  async delete(id: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/feeds/${id}`)
  }

  /**
   * Manually trigger a feed poll
   *
   * @example
   * ```typescript
   * const result = await client.feeds.poll('feed_xxxxx');
   * console.log(`Found ${result.newItems} new items`);
   * ```
   */
  async poll(id: string): Promise<{ success: boolean; newItems: number }> {
    return this.http.post<{ success: boolean; newItems: number }>(`/v1/feeds/${id}/poll`)
  }

  /**
   * Pause an active feed
   *
   * @example
   * ```typescript
   * const feed = await client.feeds.pause('feed_xxxxx');
   * ```
   */
  async pause(id: string): Promise<RssFeed> {
    return this.http.post<RssFeed>(`/v1/feeds/${id}/pause`)
  }

  /**
   * Resume a paused or errored feed
   *
   * @example
   * ```typescript
   * const feed = await client.feeds.resume('feed_xxxxx');
   * ```
   */
  async resume(id: string): Promise<RssFeed> {
    return this.http.post<RssFeed>(`/v1/feeds/${id}/resume`)
  }

  /**
   * List feed items with pagination
   *
   * @example
   * ```typescript
   * const { data, hasMore } = await client.feeds.listItems('feed_xxxxx', {
   *   limit: 20,
   * });
   * ```
   */
  async listItems(
    feedId: string,
    params?: PaginationParams & { processed?: boolean }
  ): Promise<PaginatedResponse<RssFeedItem>> {
    return this.http.get<PaginatedResponse<RssFeedItem>>(`/v1/feeds/${feedId}/items`, {
      limit: params?.limit,
      cursor: params?.cursor,
      processed: params?.processed !== undefined ? String(params.processed) : undefined,
    })
  }
}
