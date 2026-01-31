import type { HttpClient } from '../client.js'
import type {
  ApiResponse,
  CreateTemplateParams,
  GenerateAndSaveTemplateParams,
  GenerateTemplateParams,
  GeneratedTemplate,
  PaginatedResponse,
  PaginationParams,
  PreviewTemplateParams,
  PreviewTemplateResponse,
  SaveVersionParams,
  Template,
  TemplateLock,
  TemplatePresence,
  TemplateVersion,
  UpdateTemplateParams,
} from '../types.js'

/**
 * Email template management
 */
export class Templates {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new email template
   *
   * @example
   * ```typescript
   * const template = await client.templates.create({
   *   name: 'Welcome Email',
   *   subject: 'Welcome, {{firstName}}!',
   *   html: '<h1>Hello {{firstName}}!</h1>',
   *   variables: [
   *     { name: 'firstName', type: 'string', required: true },
   *   ],
   * });
   * ```
   */
  async create(params: CreateTemplateParams): Promise<Template> {
    const { variables, ...rest } = params
    const body = { ...rest, ...(variables && { variablesSchema: variables }) }
    const response = await this.http.post<ApiResponse<Record<string, unknown>>>('/v1/templates', body)
    return this.mapTemplate(response.data)
  }

  /**
   * List all templates
   *
   * @example
   * ```typescript
   * const { data } = await client.templates.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Template>> {
    return this.http.get<PaginatedResponse<Template>>('/v1/templates', {
      limit: params?.limit,
      cursor: params?.cursor,
    })
  }

  /**
   * Get a single template by ID
   *
   * @example
   * ```typescript
   * const template = await client.templates.get('template_xxxxx');
   * ```
   */
  async get(id: string): Promise<Template> {
    const response = await this.http.get<ApiResponse<Record<string, unknown>>>(`/v1/templates/${id}`)
    return this.mapTemplate(response.data)
  }

  /**
   * Update a template
   *
   * @example
   * ```typescript
   * const template = await client.templates.update('template_xxxxx', {
   *   subject: 'Updated Subject: {{firstName}}',
   * });
   * ```
   */
  async update(id: string, params: UpdateTemplateParams): Promise<Template> {
    const { variables, ...rest } = params
    const body = { ...rest, ...(variables !== undefined && { variablesSchema: variables }) }
    const response = await this.http.patch<ApiResponse<Record<string, unknown>>>(`/v1/templates/${id}`, body)
    return this.mapTemplate(response.data)
  }

  /**
   * Preview a rendered template with sample data
   *
   * @example
   * ```typescript
   * const result = await client.templates.preview({
   *   html: '<h1>Hello {{name}}!</h1>',
   *   subject: 'Welcome, {{name}}!',
   *   variables: { name: 'Alice' },
   * });
   * console.log(result.html); // '<h1>Hello Alice!</h1>'
   * ```
   */
  async preview(params: PreviewTemplateParams): Promise<PreviewTemplateResponse> {
    return this.http.post<PreviewTemplateResponse>('/v1/templates/preview', params)
  }

  /**
   * Delete a template
   *
   * @example
   * ```typescript
   * await client.templates.delete('template_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/templates/${id}`)
  }

  /**
   * Generate an email template from a natural language prompt
   *
   * Uses AI (OpenAI/Anthropic) when configured on the server, otherwise
   * falls back to a rule-based generator that handles common email types.
   *
   * @example
   * ```typescript
   * const result = await client.templates.generate({
   *   prompt: 'Create a welcome email for a SaaS product',
   *   tone: 'friendly',
   *   style: 'modern',
   *   variables: ['firstName', 'companyName'],
   * });
   *
   * console.log(result.subject);          // Generated subject line
   * console.log(result.html);             // Full HTML email
   * console.log(result.text);             // Plain text version
   * console.log(result.metadata.type);    // 'welcome'
   * console.log(result.metadata.variables); // ['firstName', 'companyName', ...]
   * ```
   */
  async generate(params: GenerateTemplateParams): Promise<GeneratedTemplate> {
    return this.http.post<GeneratedTemplate>('/v1/templates/generate', params)
  }

  /**
   * Generate an email template from a prompt and save it immediately
   *
   * Combines template generation with saving in a single API call.
   * Returns the persisted Template object.
   *
   * @example
   * ```typescript
   * const template = await client.templates.generateAndSave({
   *   prompt: 'Create a monthly newsletter template',
   *   name: 'Monthly Newsletter',
   *   tone: 'professional',
   *   style: 'colorful',
   * });
   *
   * console.log(template.id);   // 'template_xxxxx'
   * console.log(template.name); // 'Monthly Newsletter'
   * ```
   */
  async generateAndSave(params: GenerateAndSaveTemplateParams): Promise<Template> {
    const response = await this.http.post<ApiResponse<Record<string, unknown>>>('/v1/templates/generate-and-save', params)
    return this.mapTemplate(response.data)
  }

  // ===========================================================================
  // Collaboration: Locking
  // ===========================================================================

  /**
   * Acquire an edit lock on a template.
   * Locks auto-expire after 30 minutes of inactivity.
   * Returns 409 if already locked by another user.
   *
   * @example
   * ```typescript
   * const lock = await client.templates.lock('template_xxxxx');
   * console.log(lock.expiresAt); // Lock expiry time
   * ```
   */
  async lock(templateId: string): Promise<TemplateLock> {
    return this.http.post<TemplateLock>(`/v1/templates/${templateId}/lock`)
  }

  /**
   * Release an edit lock on a template.
   * Only the lock holder can release the lock.
   *
   * @example
   * ```typescript
   * await client.templates.unlock('template_xxxxx');
   * ```
   */
  async unlock(templateId: string): Promise<void> {
    await this.http.delete<void>(`/v1/templates/${templateId}/lock`)
  }

  /**
   * Extend the lock expiry time (heartbeat).
   * Call this periodically to prevent the lock from expiring while editing.
   *
   * @example
   * ```typescript
   * const lock = await client.templates.extendLock('template_xxxxx');
   * console.log(lock.expiresAt); // Updated expiry time
   * ```
   */
  async extendLock(templateId: string): Promise<TemplateLock> {
    return this.http.post<TemplateLock>(`/v1/templates/${templateId}/lock/extend`)
  }

  // ===========================================================================
  // Collaboration: Versioning
  // ===========================================================================

  /**
   * List version history for a template (most recent first).
   *
   * @example
   * ```typescript
   * const { data } = await client.templates.listVersions('template_xxxxx');
   * for (const version of data) {
   *   console.log(`v${version.version} by ${version.editedByName}`);
   * }
   * ```
   */
  async listVersions(templateId: string): Promise<PaginatedResponse<TemplateVersion>> {
    return this.http.get<PaginatedResponse<TemplateVersion>>(`/v1/templates/${templateId}/versions`)
  }

  /**
   * Get a specific version of a template.
   *
   * @example
   * ```typescript
   * const version = await client.templates.getVersion('template_xxxxx', 3);
   * console.log(version.html);
   * ```
   */
  async getVersion(templateId: string, version: number): Promise<TemplateVersion> {
    return this.http.get<TemplateVersion>(`/v1/templates/${templateId}/versions/${version}`)
  }

  /**
   * Save a new version of a template with optimistic concurrency control.
   * If `expectedVersion` does not match the current version, returns 409 Conflict.
   * Auto-releases the lock if the caller holds it.
   *
   * @example
   * ```typescript
   * const version = await client.templates.saveVersion('template_xxxxx', {
   *   html: '<h1>Updated content</h1>',
   *   subject: 'Updated subject',
   *   message: 'Fixed typo in header',
   *   expectedVersion: 3,
   * });
   * ```
   */
  async saveVersion(templateId: string, params: SaveVersionParams): Promise<TemplateVersion> {
    return this.http.post<TemplateVersion>(`/v1/templates/${templateId}/versions`, params)
  }

  /**
   * Restore a previous version of a template as a new version.
   *
   * @example
   * ```typescript
   * const version = await client.templates.restoreVersion('template_xxxxx', 2);
   * console.log(version.message); // "Restored from version 2"
   * ```
   */
  async restoreVersion(templateId: string, version: number): Promise<TemplateVersion> {
    return this.http.post<TemplateVersion>(`/v1/templates/${templateId}/restore/${version}`)
  }

  // ===========================================================================
  // Collaboration: Presence
  // ===========================================================================

  /**
   * Update presence on a template (heartbeat).
   * Call every 30 seconds to keep your presence active.
   *
   * @example
   * ```typescript
   * // Update presence with cursor position
   * await client.templates.updatePresence('template_xxxxx', { line: 10, column: 5 });
   *
   * // Update presence without cursor
   * await client.templates.updatePresence('template_xxxxx');
   * ```
   */
  async updatePresence(templateId: string, cursor?: { line: number; column: number }): Promise<void> {
    await this.http.post<void>(`/v1/templates/${templateId}/presence`, { cursor })
  }

  /**
   * Get active editors viewing/editing a template.
   * Returns only editors seen within the last 60 seconds.
   *
   * @example
   * ```typescript
   * const { data } = await client.templates.getPresence('template_xxxxx');
   * for (const editor of data) {
   *   console.log(`${editor.userName} is editing`);
   * }
   * ```
   */
  async getPresence(templateId: string): Promise<{ data: TemplatePresence[] }> {
    return this.http.get<{ data: TemplatePresence[] }>(`/v1/templates/${templateId}/presence`)
  }

  /**
   * Remove your presence from a template (call on page leave).
   *
   * @example
   * ```typescript
   * await client.templates.removePresence('template_xxxxx');
   * ```
   */
  async removePresence(templateId: string): Promise<void> {
    await this.http.delete<void>(`/v1/templates/${templateId}/presence`)
  }

  private mapTemplate(data: Record<string, unknown>): Template {
    const { variablesSchema, ...rest } = data
    return {
      ...rest,
      variables: (variablesSchema || []) as Template['variables'],
    } as Template
  }
}
