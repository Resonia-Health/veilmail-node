// Main client export
export { VeilMail } from './client.js'

// Error exports
export {
  VeilMailError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  PiiDetectedError,
  RateLimitError,
  ServerError,
  TimeoutError,
  NetworkError,
} from './errors.js'

// Type exports
export type {
  // Config
  VeilMailConfig,

  // Common
  PaginationParams,
  PaginatedResponse,
  ApiResponse,

  // Email
  EmailStatus,
  SendEmailParams,
  Email,
  EmailEvent,
  ListEmailsParams,

  // Domain
  DomainStatus,
  DnsRecord,
  CreateDomainParams,
  Domain,

  // Template
  TemplateType,
  TemplateVariable,
  CreateTemplateParams,
  UpdateTemplateParams,
  Template,
  GenerateTemplateParams,
  GeneratedTemplate,
  GenerateAndSaveTemplateParams,

  // Template Collaboration
  TemplateLock,
  TemplateVersion,
  TemplatePresence,
  SaveVersionParams,

  // Audience
  CreateAudienceParams,
  UpdateAudienceParams,
  Audience,

  // Subscriber
  SubscriberStatus,
  AddSubscriberParams,
  UpdateSubscriberParams,
  Subscriber,
  ListSubscribersParams,

  // Import
  ImportSubscriberEntry,
  ImportSubscribersParams,
  ImportSubscribersResult,

  // Export
  ExportSubscribersParams,

  // Activity
  ActivityEventType,
  ActivityEvent,
  ListActivityParams,

  // Campaign
  CampaignStatus,
  CreateCampaignParams,
  UpdateCampaignParams,
  ScheduleCampaignParams,
  CampaignStats,
  Campaign,

  // Sequence
  SequenceStatus,
  SequenceTriggerType,
  SequenceStepType,
  EnrollmentStatus,
  CreateSequenceParams,
  UpdateSequenceParams,
  SequenceStats,
  Sequence,
  CreateSequenceStepParams,
  UpdateSequenceStepParams,
  SequenceStepStats,
  SequenceStep,
  SequenceEnrollment,

  // Webhook
  WebhookEvent,
  CreateWebhookParams,
  UpdateWebhookParams,
  Webhook,
  WebhookTestResult,

  // RSS Feed
  RssFeedStatus,
  RssPollInterval,
  RssFeedMode,
  CreateRssFeedParams,
  UpdateRssFeedParams,
  RssFeed,
  RssFeedItem,

  // Signup Form
  FormFieldDefinition,
  SignupFormConsentType,
  CreateSignupFormParams,
  UpdateSignupFormParams,
  SignupFormStats,
  SignupForm,
  SignupFormSubmissionStatus,
  SignupFormSubmission,

  // Analytics
  GeoEntry,
  GeoAnalyticsResponse,
  DeviceTypeEntry,
  EmailClientEntry,
  OsEntry,
  DeviceAnalyticsResponse,

  // Email Validation
  EmailValidationCheck,
  EmailValidationVerdict,
  EmailValidationResult,
  BatchEmailValidationResult,

  // Inbound Email
  InboundRuleAction,
  InboundEmailStatus,
  CreateInboundRuleParams,
  UpdateInboundRuleParams,
  InboundRuleMxRecord,
  InboundRule,
  InboundEmail,
  ListInboundEmailsParams,

  // Dedicated IP
  DedicatedIpStatus,
  DedicatedIpWarmup,
  DedicatedIp,
  DedicatedIpWithSchedule,
  WarmingDay,
  WarmingSchedule,
  CreateIpPoolParams,
  UpdateIpPoolParams,
  IpPool,
  AddIpToPoolParams,

  // SMTP
  SmtpCredentialStatus,
  CreateSmtpCredentialParams,
  SmtpCredential,
  CreateSmtpCredentialResponse,
  RotateSmtpCredentialResponse,

  // Audit Log & Compliance
  AuditLogActorType,
  AuditLogStatus,
  AuditLog,
  AuditLogFilters,
  PaginatedAuditLogResponse,
  SecurityReport,
  RetentionSettings,
  DataRetentionPolicy,
} from './types.js'
