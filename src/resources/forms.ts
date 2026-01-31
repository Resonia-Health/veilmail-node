import type { HttpClient } from '../client.js'
import type {
  CreateSignupFormParams,
  SignupForm,
  UpdateSignupFormParams,
} from '../types.js'

/**
 * Signup form management
 */
export class Forms {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new signup form
   *
   * @example
   * ```typescript
   * const form = await client.forms.create({
   *   name: 'Newsletter Signup',
   *   slug: 'newsletter-signup',
   *   audienceId: 'audience_xxxxx',
   * });
   * ```
   */
  async create(params: CreateSignupFormParams): Promise<SignupForm> {
    return this.http.post<SignupForm>('/v1/forms', params)
  }

  /**
   * List all signup forms
   *
   * @example
   * ```typescript
   * const { data } = await client.forms.list();
   * ```
   */
  async list(): Promise<{ data: SignupForm[] }> {
    return this.http.get<{ data: SignupForm[] }>('/v1/forms')
  }

  /**
   * Get a single form by ID
   *
   * @example
   * ```typescript
   * const form = await client.forms.get('form_xxxxx');
   * ```
   */
  async get(id: string): Promise<SignupForm> {
    return this.http.get<SignupForm>(`/v1/forms/${id}`)
  }

  /**
   * Update a signup form
   *
   * @example
   * ```typescript
   * const form = await client.forms.update('form_xxxxx', {
   *   name: 'Updated Signup Form',
   * });
   * ```
   */
  async update(id: string, params: UpdateSignupFormParams): Promise<SignupForm> {
    return this.http.put<SignupForm>(`/v1/forms/${id}`, params)
  }

  /**
   * Delete a signup form
   *
   * @example
   * ```typescript
   * await client.forms.delete('form_xxxxx');
   * ```
   */
  async delete(id: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/forms/${id}`)
  }
}
