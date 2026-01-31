import type { HttpClient } from '../client.js'
import type {
  ContactProperty,
  CreateContactPropertyParams,
  SubscriberPropertyValues,
  UpdateContactPropertyParams,
} from '../types.js'

/**
 * Contact property management
 */
export class Properties {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a contact property
   *
   * @example
   * ```typescript
   * const property = await client.properties.create({
   *   key: 'company',
   *   name: 'Company',
   *   type: 'text',
   * });
   * ```
   */
  async create(params: CreateContactPropertyParams): Promise<ContactProperty> {
    const response = await this.http.post<{ data: ContactProperty }>('/v1/properties', params)
    return response.data
  }

  /**
   * List all contact properties
   *
   * @example
   * ```typescript
   * const { data } = await client.properties.list();
   * ```
   */
  async list(options?: { active?: boolean }): Promise<{ data: ContactProperty[] }> {
    return this.http.get<{ data: ContactProperty[] }>('/v1/properties', {
      active: options?.active,
    })
  }

  /**
   * Get a single contact property by ID
   *
   * @example
   * ```typescript
   * const property = await client.properties.get('prop_xxxxx');
   * ```
   */
  async get(id: string): Promise<ContactProperty> {
    const response = await this.http.get<{ data: ContactProperty }>(`/v1/properties/${id}`)
    return response.data
  }

  /**
   * Update a contact property
   *
   * @example
   * ```typescript
   * const property = await client.properties.update('prop_xxxxx', {
   *   name: 'Updated Name',
   * });
   * ```
   */
  async update(id: string, params: UpdateContactPropertyParams): Promise<ContactProperty> {
    const response = await this.http.patch<{ data: ContactProperty }>(`/v1/properties/${id}`, params)
    return response.data
  }

  /**
   * Deactivate a contact property (soft delete)
   *
   * @example
   * ```typescript
   * await client.properties.delete('prop_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete<{ success: boolean }>(`/v1/properties/${id}`)
  }

  /**
   * Get a subscriber's property values
   *
   * @example
   * ```typescript
   * const { data } = await client.properties.getValues('aud_xxx', 'sub_xxx');
   * ```
   */
  async getValues(
    audienceId: string,
    subscriberId: string,
  ): Promise<{ data: SubscriberPropertyValues }> {
    return this.http.get<{ data: SubscriberPropertyValues }>(
      `/v1/audiences/${audienceId}/subscribers/${subscriberId}/properties`,
    )
  }

  /**
   * Set a subscriber's property values (merge with existing)
   *
   * Pass null for a value to delete it.
   *
   * @example
   * ```typescript
   * await client.properties.setValues('aud_xxx', 'sub_xxx', {
   *   company: 'Acme Inc',
   *   plan: 'enterprise',
   *   age: 30,
   * });
   * ```
   */
  async setValues(
    audienceId: string,
    subscriberId: string,
    values: Record<string, string | number | boolean | null>,
  ): Promise<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `/v1/audiences/${audienceId}/subscribers/${subscriberId}/properties`,
      values,
    )
  }
}
