import type { HttpClient } from '../client.js'
import type {
  ApiResponse,
  BimiCheckResponse,
  CreateDomainParams,
  Domain,
  PaginatedResponse,
  PaginationParams,
  SetTrackingDomainParams,
  SetTrackingDomainResponse,
  UpdateDomainParams,
  VerifyTrackingDomainResponse,
} from '../types.js'

/**
 * Domain verification and management
 */
export class Domains {
  constructor(private readonly http: HttpClient) {}

  /**
   * Add a new domain for verification
   *
   * @example
   * ```typescript
   * const domain = await client.domains.create({
   *   domain: 'mail.example.com',
   * });
   * console.log(domain.dnsRecords); // DNS records to configure
   * ```
   */
  async create(params: CreateDomainParams): Promise<Domain> {
    const response = await this.http.post<ApiResponse<Domain>>('/v1/domains', params)
    return response.data
  }

  /**
   * List all domains
   *
   * @example
   * ```typescript
   * const { data } = await client.domains.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Domain>> {
    return this.http.get<PaginatedResponse<Domain>>('/v1/domains', {
      limit: params?.limit,
      cursor: params?.cursor,
    })
  }

  /**
   * Get a single domain by ID
   *
   * @example
   * ```typescript
   * const domain = await client.domains.get('domain_xxxxx');
   * ```
   */
  async get(id: string): Promise<Domain> {
    const response = await this.http.get<ApiResponse<Domain>>(`/v1/domains/${id}`)
    return response.data
  }

  /**
   * Update domain settings (tracking, etc.)
   *
   * @example
   * ```typescript
   * const domain = await client.domains.update('domain_xxxxx', {
   *   trackOpens: false,
   *   trackClicks: true,
   * });
   * ```
   */
  async update(id: string, params: UpdateDomainParams): Promise<Domain> {
    return this.http.patch<Domain>(`/v1/domains/${id}`, params)
  }

  /**
   * Trigger domain verification
   *
   * @example
   * ```typescript
   * const domain = await client.domains.verify('domain_xxxxx');
   * console.log(domain.status); // 'verified' or 'pending'
   * ```
   */
  async verify(id: string): Promise<Domain> {
    const response = await this.http.post<ApiResponse<Domain>>(`/v1/domains/${id}/verify`)
    return response.data
  }

  /**
   * Delete a domain
   *
   * @example
   * ```typescript
   * await client.domains.delete('domain_xxxxx');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/domains/${id}`)
  }

  /**
   * Check BIMI (Brand Indicators for Message Identification) DNS status
   *
   * @example
   * ```typescript
   * const bimi = await client.domains.checkBimi('domain_xxxxx');
   * if (bimi.bimi.configured) {
   *   console.log('Logo URL:', bimi.bimi.logoUrl);
   * }
   * ```
   */
  async checkBimi(id: string): Promise<BimiCheckResponse> {
    return this.http.get<BimiCheckResponse>(`/v1/domains/${id}/bimi`)
  }

  /**
   * Set a custom tracking domain for branded click/open tracking links
   *
   * @example
   * ```typescript
   * const result = await client.domains.setTrackingDomain('domain_xxxxx', {
   *   trackingDomain: 'track.example.com',
   * });
   * console.log(result.dnsInstructions); // CNAME to configure
   * ```
   */
  async setTrackingDomain(
    id: string,
    params: SetTrackingDomainParams
  ): Promise<SetTrackingDomainResponse> {
    return this.http.post<SetTrackingDomainResponse>(
      `/v1/domains/${id}/tracking-domain`,
      params
    )
  }

  /**
   * Remove the custom tracking domain
   *
   * @example
   * ```typescript
   * await client.domains.removeTrackingDomain('domain_xxxxx');
   * ```
   */
  async removeTrackingDomain(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/domains/${id}/tracking-domain`)
  }

  /**
   * Verify the custom tracking domain CNAME is configured correctly
   *
   * @example
   * ```typescript
   * const result = await client.domains.verifyTrackingDomain('domain_xxxxx');
   * if (result.trackingDomain.verified) {
   *   console.log('Tracking domain verified!');
   * }
   * ```
   */
  async verifyTrackingDomain(id: string): Promise<VerifyTrackingDomainResponse> {
    return this.http.post<VerifyTrackingDomainResponse>(
      `/v1/domains/${id}/tracking-domain/verify`
    )
  }
}
