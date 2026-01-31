import type { HttpClient } from '../client.js'
import type {
  CreateTopicParams,
  SetTopicPreferencesParams,
  Topic,
  TopicPreference,
  UpdateTopicParams,
} from '../types.js'

/**
 * Subscription topic management
 */
export class Topics {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a subscription topic
   *
   * @example
   * ```typescript
   * const topic = await client.topics.create({
   *   name: 'Weekly Digest',
   *   description: 'Our weekly newsletter with top stories',
   * });
   * ```
   */
  async create(params: CreateTopicParams): Promise<Topic> {
    return this.http.post<Topic>('/v1/topics', params)
  }

  /**
   * List all subscription topics
   *
   * @example
   * ```typescript
   * const { data } = await client.topics.list();
   * ```
   */
  async list(options?: { active?: boolean }): Promise<{ data: Topic[] }> {
    return this.http.get<{ data: Topic[] }>('/v1/topics', {
      active: options?.active,
    })
  }

  /**
   * Get a single topic by ID
   *
   * @example
   * ```typescript
   * const topic = await client.topics.get('topic_xxxxx');
   * ```
   */
  async get(id: string): Promise<Topic> {
    return this.http.get<Topic>(`/v1/topics/${id}`)
  }

  /**
   * Update a subscription topic
   *
   * @example
   * ```typescript
   * const topic = await client.topics.update('topic_xxxxx', {
   *   description: 'Updated description',
   * });
   * ```
   */
  async update(id: string, params: UpdateTopicParams): Promise<Topic> {
    return this.http.patch<Topic>(`/v1/topics/${id}`, params)
  }

  /**
   * Deactivate a subscription topic (soft delete)
   *
   * @example
   * ```typescript
   * await client.topics.delete('topic_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    return this.http.delete<void>(`/v1/topics/${id}`)
  }

  /**
   * Get a subscriber's topic preferences
   *
   * @example
   * ```typescript
   * const { data } = await client.topics.getPreferences('aud_xxx', 'sub_xxx');
   * ```
   */
  async getPreferences(
    audienceId: string,
    subscriberId: string,
  ): Promise<{ data: TopicPreference[] }> {
    return this.http.get<{ data: TopicPreference[] }>(
      `/v1/audiences/${audienceId}/subscribers/${subscriberId}/topics`,
    )
  }

  /**
   * Set a subscriber's topic preferences
   *
   * @example
   * ```typescript
   * await client.topics.setPreferences('aud_xxx', 'sub_xxx', {
   *   topics: [
   *     { topicId: 'topic_xxx', subscribed: true },
   *     { topicId: 'topic_yyy', subscribed: false },
   *   ],
   * });
   * ```
   */
  async setPreferences(
    audienceId: string,
    subscriberId: string,
    params: SetTopicPreferencesParams,
  ): Promise<{ data: TopicPreference[] }> {
    return this.http.put<{ data: TopicPreference[] }>(
      `/v1/audiences/${audienceId}/subscribers/${subscriberId}/topics`,
      params,
    )
  }
}
