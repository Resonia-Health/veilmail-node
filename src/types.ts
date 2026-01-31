// ============================================================================
// Client Configuration
// ============================================================================

export interface VeilMailConfig {
  /** API key (starts with veil_live_ or veil_test_) */
  apiKey: string
  /** Base URL for API requests (default: https://api.veilmail.xyz) */
  baseUrl?: string
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number
}

// ============================================================================
// Common Types
// ============================================================================

export interface PaginationParams {
  /** Number of items per page (default: 20, max: 100) */
  limit?: number
  /** Cursor for pagination */
  cursor?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  hasMore: boolean
  nextCursor?: string
}

export interface ApiResponse<T> {
  data: T
}

// ============================================================================
// Email Types
// ============================================================================

export type EmailStatus =
  | 'pending'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'bounced'
  | 'failed'
  | 'cancelled'
  | 'scheduled'
  | 'complained'

export interface EmailAddress {
  email: string
  name?: string
}

export interface SendEmailParams {
  /** Sender email address (can be "Name <email>" format or just email) */
  from: string
  /** Recipient email address(es) */
  to: string | string[]
  /** Email subject line */
  subject: string
  /** HTML body content */
  html?: string
  /** Plain text body content */
  text?: string
  /** CC recipients */
  cc?: string | string[]
  /** BCC recipients */
  bcc?: string | string[]
  /** Reply-to address */
  replyTo?: string
  /** Custom headers (e.g., X-Custom-Header) */
  headers?: Record<string, string>
  /** Template ID to use */
  templateId?: string
  /** Data for template variable substitution */
  templateData?: Record<string, unknown>
  /** Scheduled send time (ISO 8601) */
  scheduledFor?: string
  /** Tags for categorization */
  tags?: string[]
  /** Custom metadata */
  metadata?: Record<string, unknown>
  /** Idempotency key to prevent duplicate sends */
  idempotencyKey?: string
  /** Unsubscribe URL for marketing emails. When provided, adds List-Unsubscribe headers and footer. */
  unsubscribeUrl?: string
  /** Email type classification. Marketing emails automatically get compliance features. */
  type?: 'transactional' | 'marketing'
  /** File attachments (max 10, max 10MB total) */
  attachments?: EmailAttachment[]
  /** Subscription topic ID */
  topicId?: string
}

export interface Email {
  id: string
  from: string
  to: string[]
  subject: string
  status: EmailStatus
  createdAt: string
  // Additional fields available in detail response
  security?: {
    scanned: boolean
    clean: boolean
    detections: unknown[]
  }
  sentAt?: string | null
  deliveredAt?: string | null
  openedAt?: string | null
  openCount?: number
  clickCount?: number
  events?: EmailEvent[]
}

export interface EmailEvent {
  type: string
  timestamp: string
  data: unknown
}

export interface UpdateEmailParams {
  /** New scheduled send time (ISO 8601). Must be in the future. */
  scheduledFor: string
}

export interface CancelEmailResult {
  id: string
  status: 'cancelled'
  cancelledAt: string
}

export interface BatchSendEmailResult {
  total: number
  successful: number
  failed: number
  results: Array<
    | { index: number; id: string; status: string }
    | { index: number; status: 'failed'; error: { code: string; message: string } }
  >
}

export interface EmailAttachment {
  /** Attachment filename */
  filename: string
  /** Base64-encoded content */
  content?: string
  /** URL to fetch the attachment from (HTTPS only) */
  url?: string
  /** MIME content type */
  contentType: string
  /** Content-ID for inline attachments */
  contentId?: string
}

export interface ListEmailsParams extends PaginationParams {
  /** Filter by status */
  status?: EmailStatus
  /** Filter by tag */
  tag?: string
  /** Filter emails after this date */
  after?: string
  /** Filter emails before this date */
  before?: string
}

// ============================================================================
// Domain Types
// ============================================================================

export type DomainStatus = 'pending' | 'verified' | 'failed'

export interface DnsRecord {
  type: 'TXT' | 'CNAME' | 'MX'
  host: string
  value: string
  priority?: number
  status: 'pending' | 'verified' | 'failed'
}

export interface CreateDomainParams {
  /** Domain name (e.g., mail.example.com) */
  domain: string
}

export interface UpdateDomainParams {
  /** Enable open tracking for emails sent from this domain */
  trackOpens?: boolean
  /** Enable click tracking for emails sent from this domain */
  trackClicks?: boolean
}

export interface DomainTracking {
  opens: boolean
  clicks: boolean
}

export interface DomainDnsHealth {
  healthy: boolean
  issues: string[]
  lastCheckedAt: string | null
}

export interface DomainBimi {
  /** Whether a valid BIMI record is configured */
  configured: boolean
  /** URL to the brand logo (SVG Tiny P/S format) */
  logoUrl: string | null
  /** URL to the Verified Mark Certificate (VMC) */
  authorityUrl: string | null
}

export interface DomainTrackingDomain {
  /** Custom tracking domain (e.g., track.yourdomain.com) */
  domain: string | null
  /** Whether the CNAME has been verified */
  verified: boolean
  /** CNAME target to point the tracking domain to */
  cname: string
}

export interface BimiCheckResponse {
  domainId: string
  domain: string
  bimi: DomainBimi & {
    /** Raw BIMI DNS record value */
    rawRecord: string | null
  }
  dnsRecord: {
    type: string
    name: string
    expectedFormat: string
  }
  errors: string[]
}

export interface SetTrackingDomainParams {
  /** Custom tracking domain (e.g., track.yourdomain.com) */
  trackingDomain: string
}

export interface SetTrackingDomainResponse {
  id: string
  domain: string
  trackingDomain: DomainTrackingDomain
  dnsInstructions: {
    type: string
    name: string
    value: string
    purpose: string
  }
  message: string
}

export interface VerifyTrackingDomainResponse {
  id: string
  domain: string
  trackingDomain: DomainTrackingDomain
  errors: string[]
  message: string
}

export interface Domain {
  id: string
  domain: string
  status: DomainStatus
  dnsRecords: DnsRecord[]
  tracking: DomainTracking
  bimi: DomainBimi
  trackingDomain: DomainTrackingDomain
  dnsHealth: DomainDnsHealth
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Template Types
// ============================================================================

export type TemplateType = 'transactional' | 'marketing'

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required?: boolean
  defaultValue?: unknown
  description?: string
}

export interface CreateTemplateParams {
  /** Template name */
  name: string
  /** Email subject (supports variables) */
  subject: string
  /** HTML content (supports variables) */
  html: string
  /** Plain text content (optional) */
  text?: string
  /** Template type */
  type?: TemplateType
  /** Variable definitions */
  variables?: TemplateVariable[]
  /** Template description */
  description?: string
}

export interface UpdateTemplateParams {
  name?: string
  subject?: string
  html?: string
  text?: string
  type?: TemplateType
  variables?: TemplateVariable[]
  description?: string
}

export interface Template {
  id: string
  name: string
  subject: string
  html: string
  text: string | null
  type: TemplateType
  variables: TemplateVariable[]
  description: string | null
  version: number
  createdAt: string
  updatedAt: string
}

export interface PreviewTemplateParams {
  /** HTML template content to preview */
  html: string
  /** Subject line template to preview */
  subject?: string
  /** Variables to substitute in the template */
  variables?: Record<string, unknown>
}

export interface PreviewTemplateResponse {
  /** Rendered HTML */
  html: string
  /** Rendered subject (if subject was provided) */
  subject?: string
}

// ============================================================================
// Audience Types
// ============================================================================

export interface CreateAudienceParams {
  /** Audience name */
  name: string
  /** Audience description */
  description?: string
}

export interface UpdateAudienceParams {
  name?: string
  description?: string
}

export interface Audience {
  id: string
  name: string
  description: string | null
  subscriberCount: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Subscriber Types
// ============================================================================

export type SubscriberStatus = 'pending' | 'active' | 'unsubscribed' | 'bounced' | 'complained'

export type ConsentType = 'express' | 'implied' | 'not_set'

export interface AddSubscriberParams {
  /** Subscriber email address */
  email: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
  /** Custom metadata */
  metadata?: Record<string, unknown>
  /** Set to true to create subscriber with 'pending' status for double opt-in flow */
  doubleOptIn?: boolean
  /** Explicit status override ('pending' or 'active'). Takes precedence over doubleOptIn. */
  status?: 'pending' | 'active'
  /** CASL consent type */
  consentType?: ConsentType
  /** How consent was obtained (e.g., "signup form", "purchase") */
  consentSource?: string
  /** When consent was granted (ISO 8601) */
  consentDate?: string
  /** When implied consent expires (ISO 8601). Required for CASL implied consent. */
  consentExpiresAt?: string
  /** Evidence of consent (e.g., form submission ID) */
  consentProof?: string
}

export interface UpdateSubscriberParams {
  firstName?: string
  lastName?: string
  metadata?: Record<string, unknown>
  status?: 'pending' | 'active' | 'unsubscribed'
}

export interface SubscriberEngagement {
  /** Engagement score (0-100) */
  score: number | null
  /** Engagement tier */
  tier: EngagementTier | null
  /** When the score was last calculated */
  scoredAt: string | null
}

export type EngagementTier =
  | 'HIGHLY_ENGAGED'
  | 'ENGAGED'
  | 'MODERATELY_ENGAGED'
  | 'AT_RISK'
  | 'INACTIVE'

export interface Subscriber {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  status: SubscriberStatus
  metadata: unknown
  source: string | null
  subscribedAt: string | null
  /** Timestamp when subscriber confirmed via double opt-in */
  confirmedAt: string | null
  unsubscribedAt: string | null
  /** CASL consent type */
  consentType: ConsentType | null
  /** How consent was obtained */
  consentSource: string | null
  /** When consent was granted */
  consentDate: string | null
  /** When implied consent expires */
  consentExpiresAt: string | null
  /** Engagement scoring data */
  engagement?: SubscriberEngagement
  createdAt: string
  updatedAt?: string
}

export interface ListSubscribersParams extends PaginationParams {
  /** Filter by status */
  status?: SubscriberStatus
  /** Search by email */
  email?: string
}

// ============================================================================
// Import Types
// ============================================================================

export interface ImportSubscriberEntry {
  /** Subscriber email address */
  email: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
  /** Custom metadata */
  metadata?: Record<string, unknown>
}

export interface ImportSubscribersParams {
  /** Array of subscriber objects to import */
  subscribers?: ImportSubscriberEntry[]
  /** Raw CSV string with header row (alternative to subscribers array) */
  csvData?: string
}

export interface ImportSubscribersResult {
  /** Total number of subscribers processed */
  total: number
  /** Number of new subscribers created */
  created: number
  /** Number of existing subscribers updated */
  updated: number
  /** Number of duplicate emails skipped */
  skipped: number
  /** Parse/validation errors */
  errors: Array<{ row: number; error: string }>
}

// ============================================================================
// Export Types
// ============================================================================

export interface ExportSubscribersParams {
  /** Filter by subscriber status */
  status?: SubscriberStatus
}

// ============================================================================
// Activity Types
// ============================================================================

export type ActivityEventType =
  | 'queued'
  | 'processing'
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'complained'
  | 'unsubscribed'
  | 'failed'
  | 'cancelled'

export interface ActivityEvent {
  id: string
  type: string
  timestamp: string
  data: unknown
  email: {
    id: string
    subject: string
    from: string
    campaignId: string | null
  }
}

export interface ListActivityParams extends PaginationParams {
  /** Filter by event type */
  type?: ActivityEventType
}

// ============================================================================
// Campaign Types
// ============================================================================

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'paused'
  | 'cancelled'

export interface CreateCampaignParams {
  /** Campaign name */
  name: string
  /** Email subject */
  subject: string
  /** Sender email address */
  from: string | EmailAddress
  /** Reply-to address */
  replyTo?: string | EmailAddress
  /** Target audience ID */
  audienceId: string
  /** Template ID (optional, provide html/text if not using template) */
  templateId?: string
  /** HTML content */
  html?: string
  /** Plain text content */
  text?: string
  /** Template variables */
  variables?: Record<string, unknown>
  /** Preview text */
  previewText?: string
  /** Tags for categorization */
  tags?: string[]
}

export interface UpdateCampaignParams {
  name?: string
  subject?: string
  from?: string | EmailAddress
  replyTo?: string | EmailAddress
  audienceId?: string
  templateId?: string
  html?: string
  text?: string
  variables?: Record<string, unknown>
  previewText?: string
  tags?: string[]
}

export interface ScheduleCampaignParams {
  /** Scheduled send time (ISO 8601) */
  scheduledAt: string
}

export interface SendTestParams {
  /** Email addresses to send the test to (1-5) */
  to: string[]
}

export interface SendTestResult {
  total: number
  successful: number
  failed: number
  results: Array<{
    to: string
    success: boolean
    error?: string
  }>
}

export interface CloneCampaignOptions {
  /** Whether to also clone the A/B test configuration */
  includeABTest?: boolean
}

export interface CampaignStats {
  total: number
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  complained: number
  unsubscribed: number
}

export interface Campaign {
  id: string
  name: string
  subject: string
  from: EmailAddress
  replyTo: EmailAddress | null
  audienceId: string
  templateId: string | null
  html: string | null
  text: string | null
  previewText: string | null
  status: CampaignStatus
  tags: string[]
  stats: CampaignStats
  scheduledAt: string | null
  sentAt: string | null
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Sequence Types
// ============================================================================

export type SequenceStatus = 'draft' | 'active' | 'paused' | 'archived'
export type SequenceTriggerType = 'audience_join' | 'segment_match' | 'manual'
export type SequenceStepType = 'email' | 'delay' | 'condition'
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'removed' | 'unsubscribed' | 'bounced'

export interface CreateSequenceParams {
  /** Sequence name */
  name: string
  /** Sequence description */
  description?: string
  /** Trigger type for automatic enrollment */
  triggerType?: SequenceTriggerType
  /** Target audience ID */
  audienceId: string
  /** Optional segment ID to filter audience */
  segmentId?: string
  /** Optional topic ID for topic-based sending */
  topicId?: string
  /** Sender email address */
  fromEmail?: string
  /** Sender display name */
  fromName?: string
  /** Reply-to address */
  replyTo?: string
}

export interface UpdateSequenceParams {
  name?: string
  description?: string
  triggerType?: SequenceTriggerType
  audienceId?: string
  segmentId?: string
  topicId?: string
  fromEmail?: string
  fromName?: string
  replyTo?: string
}

export interface SequenceStats {
  enrolled: number
  completed: number
  active: number
}

export interface Sequence {
  id: string
  name: string
  description: string | null
  status: SequenceStatus
  triggerType: SequenceTriggerType
  audienceId: string
  segmentId: string | null
  topicId: string | null
  fromEmail: string | null
  fromName: string | null
  replyTo: string | null
  stats: SequenceStats
  stepsCount: number
  enrollmentsCount: number
  isReengagement: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSequenceStepParams {
  /** Step position in the sequence (0-indexed) */
  position: number
  /** Step type */
  type: SequenceStepType
  /** Email subject (for EMAIL type) */
  subject?: string
  /** Email preview text (for EMAIL type) */
  previewText?: string
  /** Email HTML content (for EMAIL type) */
  html?: string
  /** Template ID (for EMAIL type) */
  templateId?: string
  /** Delay amount (for DELAY type) */
  delayAmount?: number
  /** Delay unit: minutes, hours, days, weeks (for DELAY type) */
  delayUnit?: string
  /** Condition field (for CONDITION type) */
  conditionField?: string
  /** Condition operator (for CONDITION type) */
  conditionOperator?: string
  /** Condition value (for CONDITION type) */
  conditionValue?: string
}

export interface UpdateSequenceStepParams {
  position?: number
  type?: SequenceStepType
  subject?: string
  previewText?: string
  html?: string
  templateId?: string
  delayAmount?: number
  delayUnit?: string
  conditionField?: string
  conditionOperator?: string
  conditionValue?: string
}

export interface SequenceStepStats {
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
}

export interface SequenceStep {
  id: string
  sequenceId: string
  position: number
  type: SequenceStepType
  subject: string | null
  previewText: string | null
  html: string | null
  templateId: string | null
  delayAmount: number | null
  delayUnit: string | null
  conditionField: string | null
  conditionOperator: string | null
  conditionValue: string | null
  stats: SequenceStepStats
  createdAt: string
  updatedAt: string
}

export interface SequenceEnrollment {
  id: string
  sequenceId: string
  subscriberId: string
  subscriberEmail: string
  subscriber: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
  currentStepId: string | null
  status: EnrollmentStatus
  nextStepDueAt: string | null
  enrolledAt: string
  completedAt: string | null
  lastStepAt: string | null
}

// ============================================================================
// Webhook Types
// ============================================================================

export type WebhookEvent =
  | 'email.sent'
  | 'email.delivered'
  | 'email.opened'
  | 'email.clicked'
  | 'email.bounced'
  | 'email.complained'
  | 'email.failed'
  | 'email.delivery_delayed'
  | 'email.received'
  | 'subscriber.added'
  | 'subscriber.removed'
  | 'subscriber.unsubscribed'
  | 'contact.created'
  | 'contact.updated'
  | 'contact.deleted'
  | 'domain.created'
  | 'domain.verified'
  | 'domain.deleted'
  | 'campaign.sent'
  | 'campaign.completed'

export interface CreateWebhookParams {
  /** Webhook endpoint URL */
  url: string
  /** Events to subscribe to */
  events: WebhookEvent[]
  /** Optional description */
  description?: string
  /** Whether the webhook is enabled (default: true) */
  enabled?: boolean
}

export interface UpdateWebhookParams {
  url?: string
  events?: WebhookEvent[]
  description?: string
  enabled?: boolean
}

export interface Webhook {
  id: string
  url: string
  events: WebhookEvent[]
  description: string | null
  enabled: boolean
  secret: string
  lastTriggeredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface WebhookTestResult {
  success: boolean
  statusCode: number
  responseTime: number
  error?: string
}

// ============================================================================
// Topic Types
// ============================================================================

export interface CreateTopicParams {
  /** Topic name */
  name: string
  /** Topic description */
  description?: string
  /** Whether new subscribers are subscribed by default */
  isDefault?: boolean
  /** Sort order for display */
  sortOrder?: number
}

export interface UpdateTopicParams {
  name?: string
  description?: string | null
  isDefault?: boolean
  sortOrder?: number
  active?: boolean
}

export interface Topic {
  id: string
  name: string
  slug: string
  description: string | null
  isDefault: boolean
  sortOrder: number
  active: boolean
  subscriberCount: number
  emailCount: number
  createdAt: string
  updatedAt: string
}

export interface TopicPreference {
  topicId: string
  topicName: string
  topicSlug: string
  topicDescription: string | null
  subscribed: boolean
}

export interface SetTopicPreferencesParams {
  topics: Array<{
    topicId: string
    subscribed: boolean
  }>
}

// ============================================================================
// Contact Property Types
// ============================================================================

export type ContactPropertyType = 'text' | 'number' | 'date' | 'boolean' | 'enum'

export interface CreateContactPropertyParams {
  /** Property key (unique per organization, alphanumeric + underscore) */
  key: string
  /** Display name */
  name: string
  /** Property data type */
  type?: ContactPropertyType
  /** Description */
  description?: string
  /** Whether the property is required */
  required?: boolean
  /** Options for ENUM type properties */
  enumOptions?: string[]
  /** Sort order for display */
  sortOrder?: number
}

export interface UpdateContactPropertyParams {
  /** Display name */
  name?: string
  /** Description (set to null to clear) */
  description?: string | null
  /** Whether the property is required */
  required?: boolean
  /** Options for ENUM type properties */
  enumOptions?: string[]
  /** Sort order for display */
  sortOrder?: number
  /** Whether the property is active */
  active?: boolean
}

export interface ContactProperty {
  id: string
  key: string
  name: string
  type: ContactPropertyType
  description: string | null
  required: boolean
  enumOptions: string[] | null
  sortOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriberPropertyValues {
  [key: string]: {
    value: string
    type: string
    name: string
  }
}

// ============================================================================
// Engagement Stats Types
// ============================================================================

export interface EngagementStats {
  /** Audience ID */
  audienceId: string
  /** Average engagement score across scored subscribers */
  averageScore: number | null
  /** Number of subscribers with an engagement score */
  scoredCount: number
  /** Number of subscribers without a score */
  unscoredCount: number
  /** Distribution of subscribers by engagement tier */
  distribution: Record<EngagementTier, number>
}

export interface RecalculateEngagementResult {
  /** Audience ID */
  audienceId: string
  /** Number of subscribers processed */
  processed: number
  /** Completion timestamp */
  completedAt: string
}

// ============================================================================
// Tracked Link Types
// ============================================================================

export interface TrackedLinkStats {
  id: string
  /** Original URL */
  url: string
  /** Display-friendly URL (hostname + path, max 80 chars) */
  displayUrl: string
  /** Anchor text from the link element */
  anchorText: string | null
  /** Position of the link in the email (1-indexed) */
  position: number | null
  /** Total number of clicks */
  totalClicks: number
  /** Number of unique recipients who clicked */
  uniqueClicks: number
  /** Click-through rate as a percentage (unique clicks / sent count * 100) */
  clickRate?: number
  /** Whether the URL contains PII in query parameters */
  hasPiiInUrl: boolean
}

export interface CampaignLinkStats {
  data: TrackedLinkStats[]
}

export interface EmailLinkStats {
  data: TrackedLinkStats[]
}

export interface ListLinksParams {
  /** Maximum number of links to return (default: 20, max: 100) */
  limit?: number
  /** Sort field */
  sort?: 'totalClicks' | 'uniqueClicks' | 'url'
  /** Sort order */
  order?: 'asc' | 'desc'
}

// ============================================================================
// Geo & Device Analytics Types
// ============================================================================

export interface GeoEntry {
  /** ISO 3166-1 alpha-2 country code */
  country: string | null
  /** Full country name */
  countryName: string | null
  /** Number of events from this country */
  count: number
  /** Percentage of total events */
  percentage: number
  /** Number of Apple MPP machine-generated opens */
  machineOpenCount: number
}

export interface GeoAnalyticsResponse {
  data: GeoEntry[]
  total: number
}

export interface DeviceTypeEntry {
  /** Device type: desktop, mobile, or tablet */
  deviceType: string | null
  /** Number of events from this device type */
  count: number
  /** Percentage of total events */
  percentage: number
}

export interface EmailClientEntry {
  /** Email client name (e.g., Apple Mail, Gmail, Outlook) */
  emailClient: string | null
  /** Number of events from this email client */
  count: number
  /** Percentage of total events */
  percentage: number
}

export interface OsEntry {
  /** Operating system name */
  os: string | null
  /** Number of events from this OS */
  count: number
  /** Percentage of total events */
  percentage: number
}

export interface DeviceAnalyticsResponse {
  /** Breakdown by device type */
  deviceTypes: DeviceTypeEntry[]
  /** Breakdown by email client */
  emailClients: EmailClientEntry[]
  /** Breakdown by operating system */
  operatingSystems: OsEntry[]
  /** Total number of bot-generated events */
  botCount: number
  /** Total number of Apple MPP machine-generated opens */
  machineOpenCount: number
  /** Total number of events */
  total: number
}

// ============================================================================
// RSS Feed Types
// ============================================================================

export type RssFeedStatus = 'active' | 'paused' | 'error'
export type RssPollInterval = 'hourly' | 'daily' | 'weekly'
export type RssFeedMode = 'single' | 'digest'

export interface CreateRssFeedParams {
  /** Feed name */
  name: string
  /** RSS/Atom feed URL */
  url: string
  /** How often to poll the feed */
  pollInterval?: RssPollInterval
  /** How to create campaigns from items */
  mode?: RssFeedMode
  /** Automatically send campaigns when new items are found */
  autoSend?: boolean
  /** Template ID to use for campaigns */
  templateId?: string
  /** Target audience ID */
  audienceId: string
  /** Optional segment ID */
  segmentId?: string
  /** Optional topic ID */
  topicId?: string
  /** Sender email */
  fromEmail?: string
  /** Sender name */
  fromName?: string
  /** Reply-to address */
  replyTo?: string
  /** Max items in digest mode */
  digestMaxItems?: number
}

export interface UpdateRssFeedParams {
  name?: string
  url?: string
  pollInterval?: RssPollInterval
  mode?: RssFeedMode
  autoSend?: boolean
  templateId?: string | null
  audienceId?: string
  segmentId?: string | null
  topicId?: string | null
  fromEmail?: string | null
  fromName?: string | null
  replyTo?: string | null
  digestMaxItems?: number
}

export interface RssFeed {
  id: string
  name: string
  url: string
  status: RssFeedStatus
  pollInterval: RssPollInterval
  mode: RssFeedMode
  autoSend: boolean
  templateId: string | null
  audienceId: string
  segmentId: string | null
  topicId: string | null
  fromEmail: string | null
  fromName: string | null
  replyTo: string | null
  lastPolledAt: string | null
  lastItemDate: string | null
  lastItemGuid: string | null
  errorMessage: string | null
  errorCount: number
  successCount: number
  digestMaxItems: number
  createdAt: string
  updatedAt: string
}

export interface RssFeedItem {
  id: string
  guid: string | null
  title: string
  description: string | null
  link: string | null
  author: string | null
  pubDate: string | null
  imageUrl: string | null
  campaignId: string | null
  processed: boolean
  processedAt: string | null
  createdAt: string
}

// ============================================================================
// Signup Form Types
// ============================================================================

export interface FormFieldDefinition {
  name: string
  label: string
  type: 'text' | 'email'
  required: boolean
  placeholder?: string
}

export type SignupFormConsentType = 'express' | 'implied' | 'not_set'

export interface CreateSignupFormParams {
  /** Form name */
  name: string
  /** URL-friendly slug (unique per organization) */
  slug: string
  /** Target audience ID */
  audienceId: string
  /** Field definitions */
  fields?: FormFieldDefinition[]
  /** Topic IDs to subscribe new contacts to */
  topicIds?: string[]
  /** Allowed origins for CORS */
  allowedOrigins?: string[]
  /** Enable honeypot spam protection */
  honeypotEnabled?: boolean
  /** Require double opt-in confirmation */
  doubleOptIn?: boolean
  /** Consent text displayed to users */
  consentText?: string
  /** Consent type for CASL compliance */
  consentType?: 'EXPRESS' | 'IMPLIED' | 'NOT_SET'
  /** Show privacy policy link */
  showPrivacyLink?: boolean
  /** Privacy policy URL */
  privacyUrl?: string
  /** Message shown after successful submission */
  successMessage?: string
  /** Redirect URL after submission */
  redirectUrl?: string
  /** Use organization brand kit styling */
  useBrandKit?: boolean
  /** Custom styling configuration */
  styling?: Record<string, unknown>
  /** Max submissions per hour (global) */
  maxSubmissionsPerHour?: number
  /** Max submissions per IP per hour */
  maxSubmissionsPerIp?: number
}

export interface UpdateSignupFormParams {
  name?: string
  slug?: string
  audienceId?: string
  fields?: FormFieldDefinition[]
  topicIds?: string[]
  allowedOrigins?: string[]
  honeypotEnabled?: boolean
  doubleOptIn?: boolean
  consentText?: string
  consentType?: 'EXPRESS' | 'IMPLIED' | 'NOT_SET'
  showPrivacyLink?: boolean
  privacyUrl?: string
  successMessage?: string
  redirectUrl?: string
  useBrandKit?: boolean
  styling?: Record<string, unknown>
  active?: boolean
  maxSubmissionsPerHour?: number
  maxSubmissionsPerIp?: number
}

export interface SignupFormStats {
  views: number
  submissions: number
}

export interface SignupForm {
  id: string
  name: string
  slug: string
  fields: FormFieldDefinition[]
  styling: Record<string, unknown> | null
  successMessage: string
  redirectUrl: string | null
  audienceId: string
  topicIds: string[]
  formToken: string
  allowedOrigins: string[]
  honeypotEnabled: boolean
  recaptchaEnabled: boolean
  doubleOptIn: boolean
  consentText: string | null
  consentType: SignupFormConsentType
  showPrivacyLink: boolean
  privacyUrl: string | null
  useBrandKit: boolean
  active: boolean
  stats: SignupFormStats
  maxSubmissionsPerHour: number
  maxSubmissionsPerIp: number
  createdAt: string
  updatedAt: string
}

export type SignupFormSubmissionStatus = 'pending' | 'processed' | 'duplicate' | 'spam' | 'failed'

export interface SignupFormSubmission {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  data: Record<string, unknown> | null
  topicIds: string[]
  status: SignupFormSubmissionStatus
  ipAddress: string | null
  userAgent: string | null
  honeypotTriggered: boolean
  subscriberId: string | null
  formId: string
  createdAt: string
}

// ============================================================================
// Email Validation Types
// ============================================================================

export interface EmailValidationCheck {
  valid?: boolean
  records?: string[]
  disposable?: boolean
  role?: boolean
  free?: boolean
}

export type EmailValidationVerdict = 'valid' | 'risky' | 'invalid'

export interface EmailValidationResult {
  email: string
  verdict: EmailValidationVerdict
  score: number
  checks: {
    syntax: { valid: boolean }
    mx: { valid: boolean; records: string[] }
    disposable: { disposable: boolean }
    role: { role: boolean }
    freeProvider: { free: boolean }
  }
  suggestion: string | null
}

export interface BatchEmailValidationResult {
  results: EmailValidationResult[]
}

// ============================================================================
// Inbound Email Types
// ============================================================================

export type InboundRuleAction = 'webhook' | 'store' | 'store_and_webhook'

export type InboundEmailStatus = 'received' | 'forwarded' | 'failed'

export interface CreateInboundRuleParams {
  /** Domain ID to create the rule for (must be verified) */
  domainId: string
  /** Pattern to match on the To address: "*" for wildcard, "support@" for prefix, or full address */
  matchPattern: string
  /** Webhook URL to forward parsed emails to */
  forwardTo?: string
  /** Action to take when an email matches: webhook, store, or store_and_webhook */
  action?: InboundRuleAction
}

export interface UpdateInboundRuleParams {
  /** Pattern to match on the To address */
  matchPattern?: string
  /** Webhook URL to forward parsed emails to (set to null to clear) */
  forwardTo?: string | null
  /** Action to take when an email matches */
  action?: InboundRuleAction
  /** Enable or disable the rule */
  enabled?: boolean
}

export interface InboundRuleMxRecord {
  type: 'MX'
  name: string
  value: string
  priority: number
  purpose: string
}

export interface InboundRule {
  id: string
  domainId: string
  domain: string
  matchPattern: string
  forwardTo: string | null
  action: InboundRuleAction
  enabled: boolean
  createdAt: string
  updatedAt: string
  /** MX record instructions (included in create and get responses) */
  mxRecord?: InboundRuleMxRecord
}

export interface InboundEmail {
  id: string
  ruleId: string | null
  from: string
  to: string
  subject: string
  textBody?: string | null
  htmlBody?: string | null
  headers?: Record<string, string>
  attachments?: Array<{
    filename: string
    contentType: string
    size: number
    storageKey?: string
  }>
  spamScore: number | null
  status: InboundEmailStatus
  receivedAt: string
  createdAt: string
}

export interface ListInboundEmailsParams extends PaginationParams {
  /** Filter by inbound rule ID */
  ruleId?: string
  /** Filter by sender email (partial match) */
  from?: string
  /** Filter by recipient email (partial match) */
  to?: string
  /** Filter by status */
  status?: InboundEmailStatus
}

// ============================================================================
// AI Template Generation Types
// ============================================================================

export interface GenerateTemplateParams {
  /** Natural language description of the email template to generate */
  prompt: string
  /** Tone of the generated email */
  tone?: 'professional' | 'casual' | 'friendly'
  /** Visual style of the generated email */
  style?: 'minimal' | 'modern' | 'colorful'
  /** Handlebars template variables to include */
  variables?: string[]
  /** Template type hint (welcome, newsletter, notification, receipt, password-reset, promotional) */
  type?: string
}

export interface GeneratedTemplate {
  /** Generated HTML email content */
  html: string
  /** Generated plain text email content */
  text: string
  /** Generated email subject line */
  subject: string
  /** Metadata about the generated template */
  metadata: {
    /** Detected or specified template type */
    type: string
    /** Handlebars variables used in the template */
    variables: string[]
  }
}

export interface GenerateAndSaveTemplateParams extends GenerateTemplateParams {
  /** Name for the saved template */
  name: string
}

// ============================================================================
// Dedicated IP Types
// ============================================================================

export type DedicatedIpStatus =
  | 'provisioning'
  | 'warming'
  | 'active'
  | 'cooldown'
  | 'released'

export interface DedicatedIpWarmup {
  progress: number
  startedAt: string | null
  completedAt: string | null
  currentDailyLimit: number
}

export interface DedicatedIp {
  id: string
  ipAddress: string
  status: DedicatedIpStatus
  warmup: DedicatedIpWarmup
  poolId: string | null
  sendingVolume: number
  lastUsedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface WarmingDay {
  day: number
  dailyLimit: number
  cumulativeProgress: number
}

export interface WarmingSchedule {
  days: WarmingDay[]
  totalDays: number
}

export interface DedicatedIpWithSchedule extends DedicatedIp {
  warmingSchedule?: WarmingSchedule
}

export interface CreateIpPoolParams {
  /** Pool name (unique per organization) */
  name: string
  /** Set as the default pool */
  isDefault?: boolean
}

export interface UpdateIpPoolParams {
  /** Pool name */
  name?: string
  /** Set as the default pool */
  isDefault?: boolean
}

export interface IpPool {
  id: string
  name: string
  isDefault: boolean
  ipCount: number
  createdAt: string
  updatedAt: string
}

export interface AddIpToPoolParams {
  /** ID of the dedicated IP to add */
  ipId: string
}

// ============================================================================
// SMTP Credential Types
// ============================================================================

export type SmtpCredentialStatus = 'active' | 'revoked'

export interface CreateSmtpCredentialParams {
  /** Friendly name for the credential */
  name: string
  /** Optional IP pool assignment */
  ipPoolId?: string
}

export interface SmtpCredential {
  id: string
  username: string
  name: string
  status: SmtpCredentialStatus
  smtpHost: string
  smtpPort: number
  smtpPortTls: number
  lastUsedAt: string | null
  ipPoolId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateSmtpCredentialResponse extends SmtpCredential {
  /** The password is returned only once upon creation. Store it securely. */
  password: string
}

export interface RotateSmtpCredentialResponse extends SmtpCredential {
  /** The new password is returned only once. Store it securely. */
  password: string
}

// ============================================================================
// Audit Log & Compliance Types
// ============================================================================

export type AuditLogActorType = 'user' | 'api_key' | 'system' | 'admin'
export type AuditLogStatus = 'success' | 'failure' | 'denied'

export interface AuditLog {
  id: string
  organizationId: string | null
  actorType: AuditLogActorType
  actorId: string
  actorEmail: string | null
  action: string
  resourceType: string
  resourceId: string | null
  metadata: unknown
  ipAddress: string | null
  userAgent: string | null
  status: AuditLogStatus
  reason: string | null
  createdAt: string
}

export interface AuditLogFilters {
  /** Filter by actor ID */
  actorId?: string
  /** Filter by action (e.g., "email.send", "api_key.create") */
  action?: string
  /** Filter by resource type (e.g., "email", "api_key") */
  resourceType?: string
  /** Filter by resource ID */
  resourceId?: string
  /** Filter by status */
  status?: AuditLogStatus
  /** Start date (ISO 8601) */
  from?: string
  /** End date (ISO 8601) */
  to?: string
  /** Number of items per page (default: 50, max: 100) */
  limit?: number
  /** Cursor for pagination */
  cursor?: string
}

export interface PaginatedAuditLogResponse {
  data: AuditLog[]
  hasMore: boolean
  nextCursor?: string
  total: number
}

export interface SecurityReport {
  generatedAt: string
  organizationId: string
  apiKeyInventory: {
    total: number
    active: number
    revoked: number
    expired: number
    neverUsed: number
    keys: Array<{
      id: string
      name: string
      keyPrefix: string
      lastFour: string
      scopes: string[]
      isTest: boolean
      lastUsedAt: string | null
      expiresAt: string | null
      revokedAt: string | null
      usageCount: number
      createdAt: string
    }>
  }
  recentAuthFailures: {
    count: number
    entries: Array<{
      action: string
      actorId: string
      ipAddress: string | null
      reason: string | null
      createdAt: string
    }>
  }
  highPrivilegeActions: {
    count: number
    entries: Array<{
      action: string
      actorType: string
      actorId: string
      resourceType: string
      resourceId: string | null
      createdAt: string
    }>
  }
  dataAccessPatterns: {
    totalApiCalls: number
    uniqueIps: number
    topEndpoints: Array<{
      path: string
      count: number
    }>
  }
}

export interface RetentionSettings {
  emailEventRetentionDays?: number
  auditLogRetentionDays?: number
  apiLogRetentionDays?: number
  inboundEmailRetentionDays?: number
}

export interface DataRetentionPolicy {
  id: string
  organizationId: string
  emailEventRetentionDays: number
  auditLogRetentionDays: number
  apiLogRetentionDays: number
  inboundEmailRetentionDays: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Template Collaboration Types
// ============================================================================

export interface TemplateLock {
  id: string
  templateId: string
  lockedBy: string
  lockedByName: string
  lockedAt: string
  expiresAt: string
}

export interface TemplateVersion {
  id: string
  templateId: string
  version: number
  html: string
  subject: string | null
  editedBy: string
  editedByName: string
  message: string | null
  createdAt: string
}

export interface TemplatePresence {
  userId: string
  userName: string
  cursor: { line: number; column: number } | null
  lastSeenAt: string
}

export interface SaveVersionParams {
  /** HTML content for the new version */
  html: string
  /** Updated subject line */
  subject?: string
  /** Optional commit message describing the changes */
  message?: string
  /** Expected current version number for optimistic concurrency control */
  expectedVersion: number
}

// ============================================================================
// API Error Types
// ============================================================================

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}
