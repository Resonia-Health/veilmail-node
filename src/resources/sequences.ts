import type { HttpClient } from '../client.js'
import type {
  CreateSequenceParams,
  CreateSequenceStepParams,
  PaginatedResponse,
  PaginationParams,
  Sequence,
  SequenceEnrollment,
  SequenceStep,
  UpdateSequenceParams,
  UpdateSequenceStepParams,
} from '../types.js'

/**
 * Automation sequence management
 */
export class Sequences {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new automation sequence
   *
   * @example
   * ```typescript
   * const sequence = await client.sequences.create({
   *   name: 'Welcome Series',
   *   audienceId: 'audience_xxxxx',
   *   triggerType: 'audience_join',
   * });
   * ```
   */
  async create(params: CreateSequenceParams): Promise<Sequence> {
    return this.http.post<Sequence>('/v1/sequences', params)
  }

  /**
   * List all automation sequences
   *
   * @example
   * ```typescript
   * const { data } = await client.sequences.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Sequence>> {
    return this.http.get<PaginatedResponse<Sequence>>('/v1/sequences', {
      limit: params?.limit,
      cursor: params?.cursor,
    })
  }

  /**
   * Get a single sequence by ID
   *
   * @example
   * ```typescript
   * const sequence = await client.sequences.get('sequence_xxxxx');
   * ```
   */
  async get(id: string): Promise<Sequence> {
    return this.http.get<Sequence>(`/v1/sequences/${id}`)
  }

  /**
   * Update a sequence (only DRAFT or PAUSED sequences)
   *
   * @example
   * ```typescript
   * const sequence = await client.sequences.update('sequence_xxxxx', {
   *   name: 'Updated Welcome Series',
   * });
   * ```
   */
  async update(id: string, params: UpdateSequenceParams): Promise<Sequence> {
    return this.http.put<Sequence>(`/v1/sequences/${id}`, params)
  }

  /**
   * Delete a sequence (only DRAFT sequences)
   *
   * @example
   * ```typescript
   * await client.sequences.delete('sequence_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/sequences/${id}`)
  }

  /**
   * Activate a sequence
   *
   * @example
   * ```typescript
   * const sequence = await client.sequences.activate('sequence_xxxxx');
   * ```
   */
  async activate(id: string): Promise<Sequence> {
    return this.http.post<Sequence>(`/v1/sequences/${id}/activate`)
  }

  /**
   * Pause an active sequence
   *
   * @example
   * ```typescript
   * const sequence = await client.sequences.pause('sequence_xxxxx');
   * ```
   */
  async pause(id: string): Promise<Sequence> {
    return this.http.post<Sequence>(`/v1/sequences/${id}/pause`)
  }

  /**
   * Archive a sequence
   *
   * @example
   * ```typescript
   * const sequence = await client.sequences.archive('sequence_xxxxx');
   * ```
   */
  async archive(id: string): Promise<Sequence> {
    return this.http.post<Sequence>(`/v1/sequences/${id}/archive`)
  }

  /**
   * Add a step to a sequence
   *
   * @example
   * ```typescript
   * const step = await client.sequences.addStep('sequence_xxxxx', {
   *   position: 0,
   *   type: 'email',
   *   subject: 'Welcome!',
   *   html: '<p>Hello {{firstName}}</p>',
   * });
   * ```
   */
  async addStep(sequenceId: string, params: CreateSequenceStepParams): Promise<SequenceStep> {
    return this.http.post<SequenceStep>(`/v1/sequences/${sequenceId}/steps`, params)
  }

  /**
   * Update a sequence step
   *
   * @example
   * ```typescript
   * const step = await client.sequences.updateStep('sequence_xxxxx', 'step_xxxxx', {
   *   subject: 'Updated Welcome!',
   * });
   * ```
   */
  async updateStep(sequenceId: string, stepId: string, params: UpdateSequenceStepParams): Promise<SequenceStep> {
    return this.http.put<SequenceStep>(`/v1/sequences/${sequenceId}/steps/${stepId}`, params)
  }

  /**
   * Delete a sequence step
   *
   * @example
   * ```typescript
   * await client.sequences.deleteStep('sequence_xxxxx', 'step_xxxxx');
   * ```
   */
  async deleteStep(sequenceId: string, stepId: string): Promise<void> {
    await this.http.delete<void>(`/v1/sequences/${sequenceId}/steps/${stepId}`)
  }

  /**
   * Reorder sequence steps
   *
   * @example
   * ```typescript
   * await client.sequences.reorderSteps('sequence_xxxxx', [
   *   { id: 'step_1', position: 0 },
   *   { id: 'step_2', position: 1 },
   * ]);
   * ```
   */
  async reorderSteps(sequenceId: string, steps: { id: string; position: number }[]): Promise<void> {
    await this.http.post<void>(`/v1/sequences/${sequenceId}/steps/reorder`, { steps })
  }

  /**
   * Manually enroll subscribers into a sequence
   *
   * @example
   * ```typescript
   * const result = await client.sequences.enroll('sequence_xxxxx', ['sub_1', 'sub_2']);
   * console.log(result.enrolled); // 2
   * ```
   */
  async enroll(sequenceId: string, subscriberIds: string[]): Promise<{ enrolled: number }> {
    return this.http.post<{ enrolled: number }>(`/v1/sequences/${sequenceId}/enroll`, { subscriberIds })
  }

  /**
   * List enrollments for a sequence
   *
   * @example
   * ```typescript
   * const { data } = await client.sequences.listEnrollments('sequence_xxxxx');
   * ```
   */
  async listEnrollments(sequenceId: string, params?: PaginationParams): Promise<PaginatedResponse<SequenceEnrollment>> {
    return this.http.get<PaginatedResponse<SequenceEnrollment>>(`/v1/sequences/${sequenceId}/enrollments`, {
      limit: params?.limit,
      cursor: params?.cursor,
    })
  }

  /**
   * Remove an enrollment from a sequence
   *
   * @example
   * ```typescript
   * await client.sequences.removeEnrollment('sequence_xxxxx', 'enrollment_xxxxx');
   * ```
   */
  async removeEnrollment(sequenceId: string, enrollmentId: string): Promise<void> {
    await this.http.delete<void>(`/v1/sequences/${sequenceId}/enrollments/${enrollmentId}`)
  }
}
