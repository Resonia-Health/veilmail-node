import type { HttpClient } from '../client.js'
import type {
  AddIpToPoolParams,
  CreateIpPoolParams,
  DedicatedIp,
  DedicatedIpWithSchedule,
  IpPool,
  PaginatedResponse,
  UpdateIpPoolParams,
} from '../types.js'

/**
 * Dedicated IP and IP pool management
 */
export class DedicatedIps {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all dedicated IPs for the organization
   *
   * @example
   * ```typescript
   * const { data } = await client.dedicatedIps.list();
   * for (const ip of data) {
   *   console.log(`${ip.ipAddress}: ${ip.status}`);
   * }
   * ```
   */
  async list(): Promise<PaginatedResponse<DedicatedIp>> {
    return this.http.get<PaginatedResponse<DedicatedIp>>('/v1/dedicated-ips')
  }

  /**
   * Request a new dedicated IP
   *
   * @example
   * ```typescript
   * const ip = await client.dedicatedIps.create();
   * console.log(ip.status); // 'provisioning'
   * ```
   */
  async create(): Promise<DedicatedIp> {
    return this.http.post<DedicatedIp>('/v1/dedicated-ips')
  }

  /**
   * Get a dedicated IP by ID, including warming progress
   *
   * @example
   * ```typescript
   * const ip = await client.dedicatedIps.get('ip_xxxxx');
   * console.log(ip.warmup.progress); // 0.5
   * ```
   */
  async get(id: string): Promise<DedicatedIpWithSchedule> {
    return this.http.get<DedicatedIpWithSchedule>(`/v1/dedicated-ips/${id}`)
  }

  /**
   * Release a dedicated IP
   *
   * @example
   * ```typescript
   * await client.dedicatedIps.release('ip_xxxxx');
   * ```
   */
  async release(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/dedicated-ips/${id}`)
  }

  /**
   * Start IP warming schedule
   *
   * @example
   * ```typescript
   * const ip = await client.dedicatedIps.startWarmup('ip_xxxxx');
   * console.log(ip.warmingSchedule); // 14-day plan
   * ```
   */
  async startWarmup(id: string): Promise<DedicatedIpWithSchedule> {
    return this.http.post<DedicatedIpWithSchedule>(`/v1/dedicated-ips/${id}/warmup`)
  }

  // ---- IP Pool methods ----

  /**
   * List all IP pools
   *
   * @example
   * ```typescript
   * const { data } = await client.dedicatedIps.listPools();
   * ```
   */
  async listPools(): Promise<PaginatedResponse<IpPool>> {
    return this.http.get<PaginatedResponse<IpPool>>('/v1/dedicated-ips/pools')
  }

  /**
   * Create an IP pool
   *
   * @example
   * ```typescript
   * const pool = await client.dedicatedIps.createPool({
   *   name: 'Transactional',
   *   isDefault: true,
   * });
   * ```
   */
  async createPool(params: CreateIpPoolParams): Promise<IpPool> {
    return this.http.post<IpPool>('/v1/dedicated-ips/pools', params)
  }

  /**
   * Update an IP pool
   *
   * @example
   * ```typescript
   * const pool = await client.dedicatedIps.updatePool('pool_xxxxx', {
   *   name: 'Marketing',
   * });
   * ```
   */
  async updatePool(poolId: string, params: UpdateIpPoolParams): Promise<IpPool> {
    return this.http.patch<IpPool>(`/v1/dedicated-ips/pools/${poolId}`, params)
  }

  /**
   * Delete an IP pool
   *
   * @example
   * ```typescript
   * await client.dedicatedIps.deletePool('pool_xxxxx');
   * ```
   */
  async deletePool(poolId: string): Promise<void> {
    await this.http.delete<void>(`/v1/dedicated-ips/pools/${poolId}`)
  }

  /**
   * Add a dedicated IP to a pool
   *
   * @example
   * ```typescript
   * const ip = await client.dedicatedIps.addIpToPool('pool_xxxxx', {
   *   ipId: 'ip_xxxxx',
   * });
   * ```
   */
  async addIpToPool(poolId: string, params: AddIpToPoolParams): Promise<DedicatedIp> {
    return this.http.post<DedicatedIp>(`/v1/dedicated-ips/pools/${poolId}/ips`, params)
  }

  /**
   * Remove a dedicated IP from a pool
   *
   * @example
   * ```typescript
   * await client.dedicatedIps.removeIpFromPool('pool_xxxxx', 'ip_xxxxx');
   * ```
   */
  async removeIpFromPool(poolId: string, ipId: string): Promise<void> {
    await this.http.delete<void>(`/v1/dedicated-ips/pools/${poolId}/ips/${ipId}`)
  }
}
