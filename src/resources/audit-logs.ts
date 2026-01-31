import type { HttpClient } from '../client.js'
import type {
  AuditLog,
  AuditLogFilters,
  DataRetentionPolicy,
  PaginatedAuditLogResponse,
  RetentionSettings,
  SecurityReport,
} from '../types.js'

/**
 * Audit log and compliance management
 *
 * @example
 * ```typescript
 * // List recent audit logs
 * const { data, hasMore } = await client.auditLogs.list({
 *   action: 'email.send',
 *   limit: 20,
 * });
 *
 * // Get a security report
 * const report = await client.auditLogs.getSecurityReport();
 * ```
 */
export class AuditLogs {
  constructor(private readonly http: HttpClient) {}

  /**
   * List audit logs with optional filters
   *
   * @example
   * ```typescript
   * const { data, hasMore } = await client.auditLogs.list({
   *   action: 'api_key.create',
   *   from: '2025-01-01T00:00:00Z',
   *   to: '2025-01-31T23:59:59Z',
   * });
   * ```
   */
  async list(filters?: AuditLogFilters): Promise<PaginatedAuditLogResponse> {
    return this.http.get<PaginatedAuditLogResponse>('/v1/audit-logs', {
      actorId: filters?.actorId,
      action: filters?.action,
      resourceType: filters?.resourceType,
      resourceId: filters?.resourceId,
      status: filters?.status,
      from: filters?.from,
      to: filters?.to,
      limit: filters?.limit,
      cursor: filters?.cursor,
    })
  }

  /**
   * Get a single audit log entry by ID
   *
   * @example
   * ```typescript
   * const log = await client.auditLogs.get('cuid_xxxxx');
   * console.log(log.action); // "email.send"
   * ```
   */
  async get(id: string): Promise<AuditLog> {
    return this.http.get<AuditLog>(`/v1/audit-logs/${id}`)
  }

  /**
   * Generate a security compliance report for the organization
   *
   * @example
   * ```typescript
   * const report = await client.auditLogs.getSecurityReport();
   * console.log(report.apiKeyInventory.active); // Number of active keys
   * console.log(report.recentAuthFailures.count); // Failed auth attempts
   * ```
   */
  async getSecurityReport(): Promise<SecurityReport> {
    return this.http.get<SecurityReport>('/v1/audit-logs/security/report')
  }

  /**
   * Get the data retention policy for the organization
   *
   * @example
   * ```typescript
   * const policy = await client.auditLogs.getRetentionPolicy();
   * console.log(policy.auditLogRetentionDays); // 365
   * ```
   */
  async getRetentionPolicy(): Promise<DataRetentionPolicy> {
    return this.http.get<DataRetentionPolicy>('/v1/audit-logs/retention')
  }

  /**
   * Update the data retention policy for the organization
   *
   * @example
   * ```typescript
   * const updated = await client.auditLogs.updateRetentionPolicy({
   *   auditLogRetentionDays: 730,
   *   apiLogRetentionDays: 60,
   * });
   * ```
   */
  async updateRetentionPolicy(
    settings: Partial<RetentionSettings>
  ): Promise<DataRetentionPolicy> {
    return this.http.patch<DataRetentionPolicy>(
      '/v1/audit-logs/retention',
      settings
    )
  }
}
