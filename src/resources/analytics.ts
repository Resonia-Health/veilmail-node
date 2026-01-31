import type { HttpClient } from '../client.js'
import type {
  DeviceAnalyticsResponse,
  GeoAnalyticsResponse,
} from '../types.js'

// ============================================================================
// Query parameter types
// ============================================================================

export interface GeoAnalyticsParams {
  /** Number of days to look back (max 90, default 30). Only for org-level. */
  days?: number
  /** Filter by event type (default: OPENED) */
  eventType?: 'OPENED' | 'CLICKED'
}

export interface DeviceAnalyticsParams {
  /** Number of days to look back (max 90, default 30). Only for org-level. */
  days?: number
  /** Filter by event type (default: OPENED) */
  eventType?: 'OPENED' | 'CLICKED'
}

// ============================================================================
// Analytics resource
// ============================================================================

/**
 * Geo and device analytics
 */
export class Analytics {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get organization-level geo analytics
   *
   * @example
   * ```typescript
   * const geoData = await client.analytics.geo({ days: 30, eventType: 'OPENED' });
   * geoData.data.forEach(entry => {
   *   console.log(`${entry.countryName}: ${entry.count} (${entry.percentage}%)`);
   * });
   * ```
   */
  async geo(params?: GeoAnalyticsParams): Promise<GeoAnalyticsResponse> {
    return this.http.get<GeoAnalyticsResponse>('/v1/analytics/geo', {
      days: params?.days,
      eventType: params?.eventType,
    })
  }

  /**
   * Get organization-level device analytics
   *
   * @example
   * ```typescript
   * const deviceData = await client.analytics.devices({ days: 30 });
   * console.log('Bot opens:', deviceData.botCount);
   * console.log('Machine opens:', deviceData.machineOpenCount);
   * ```
   */
  async devices(params?: DeviceAnalyticsParams): Promise<DeviceAnalyticsResponse> {
    return this.http.get<DeviceAnalyticsResponse>('/v1/analytics/devices', {
      days: params?.days,
      eventType: params?.eventType,
    })
  }

  /**
   * Get campaign-level geo analytics
   *
   * @example
   * ```typescript
   * const geoData = await client.analytics.campaignGeo('campaign_xxxxx');
   * ```
   */
  async campaignGeo(campaignId: string, params?: Pick<GeoAnalyticsParams, 'eventType'>): Promise<GeoAnalyticsResponse> {
    return this.http.get<GeoAnalyticsResponse>(`/v1/campaigns/${campaignId}/analytics/geo`, {
      eventType: params?.eventType,
    })
  }

  /**
   * Get campaign-level device analytics
   *
   * @example
   * ```typescript
   * const deviceData = await client.analytics.campaignDevices('campaign_xxxxx');
   * ```
   */
  async campaignDevices(campaignId: string, params?: Pick<DeviceAnalyticsParams, 'eventType'>): Promise<DeviceAnalyticsResponse> {
    return this.http.get<DeviceAnalyticsResponse>(`/v1/campaigns/${campaignId}/analytics/devices`, {
      eventType: params?.eventType,
    })
  }
}
