# @resonia/veilmail-sdk

The official Node.js SDK for [Veil Mail](https://veilmail.xyz) - secure email with automatic PII protection.

## Installation

```bash
npm install @resonia/veilmail-sdk
# or
pnpm add @resonia/veilmail-sdk
# or
yarn add @resonia/veilmail-sdk
```

## Quick Start

```typescript
import { VeilMail } from '@resonia/veilmail-sdk';

const client = new VeilMail('veil_live_xxxxx');

// Send an email
const email = await client.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our platform!</h1>',
});

console.log(email.id); // email_xxxxx
```

## Features

- **Full TypeScript support** - Complete type definitions for all API operations
- **Automatic PII protection** - Emails are scanned for sensitive data before sending
- **Zero dependencies** - Uses native `fetch` (Node.js 18+)
- **Comprehensive error handling** - Typed errors for different scenarios

## API Reference

### Emails

```typescript
// Send an email
await client.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Hello!',
  html: '<h1>Welcome!</h1>',
});

// Send with a template
await client.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  templateId: 'template_xxxxx',
  variables: { firstName: 'John' },
});

// List emails
const { data, hasMore } = await client.emails.list({ limit: 20 });

// Get a single email
const email = await client.emails.get('email_xxxxx');

// Cancel a scheduled email
await client.emails.cancel('email_xxxxx');
```

### Domains

```typescript
// Add a domain
const domain = await client.domains.create({ domain: 'mail.example.com' });
console.log(domain.dnsRecords); // DNS records to configure

// Verify domain DNS
await client.domains.verify('domain_xxxxx');

// List domains
const { data } = await client.domains.list();

// Delete a domain
await client.domains.delete('domain_xxxxx');
```

### Templates

```typescript
// Create a template
const template = await client.templates.create({
  name: 'Welcome Email',
  subject: 'Welcome, {{firstName}}!',
  html: '<h1>Hello {{firstName}}!</h1>',
  variables: [{ name: 'firstName', type: 'string', required: true }],
});

// List templates
const { data } = await client.templates.list();

// Update a template
await client.templates.update('template_xxxxx', {
  subject: 'Updated Subject',
});

// Delete a template
await client.templates.delete('template_xxxxx');
```

### Audiences

```typescript
// Create an audience
const audience = await client.audiences.create({
  name: 'Newsletter Subscribers',
  description: 'Users who signed up for updates',
});

// Add a subscriber
const subscriber = await client.audiences.subscribers('audience_xxxxx').add({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
});

// Add a subscriber with double opt-in (starts as pending)
const pending = await client.audiences.subscribers('audience_xxxxx').add({
  email: 'user@example.com',
  firstName: 'John',
  doubleOptIn: true, // Status will be 'pending' until confirmed
});

// Confirm a pending subscriber (after they click confirmation link)
const confirmed = await client.audiences.subscribers('audience_xxxxx').confirm('subscriber_xxxxx');
// confirmed.status === 'active', confirmed.confirmedAt is set

// List subscribers (filter by status: 'pending', 'active', 'unsubscribed', etc.)
const { data } = await client.audiences.subscribers('audience_xxxxx').list({
  status: 'active',
});

// Remove a subscriber
await client.audiences.subscribers('audience_xxxxx').remove('subscriber_xxxxx');
```

### Campaigns

```typescript
// Create a campaign
const campaign = await client.campaigns.create({
  name: 'December Newsletter',
  subject: 'Our December Updates',
  from: 'news@example.com',
  audienceId: 'audience_xxxxx',
  templateId: 'template_xxxxx',
});

// Schedule for later
await client.campaigns.schedule('campaign_xxxxx', {
  scheduledAt: '2024-12-25T09:00:00Z',
});

// Or send immediately
await client.campaigns.send('campaign_xxxxx');

// Pause a sending campaign
await client.campaigns.pause('campaign_xxxxx');

// Resume a paused campaign
await client.campaigns.resume('campaign_xxxxx');

// Cancel a campaign
await client.campaigns.cancel('campaign_xxxxx');
```

### Webhooks

```typescript
// Create a webhook
const webhook = await client.webhooks.create({
  url: 'https://example.com/webhooks/veilmail',
  events: ['email.delivered', 'email.bounced'],
});
console.log(webhook.secret); // Use this to verify signatures

// Test a webhook
const result = await client.webhooks.test('webhook_xxxxx');

// Rotate signing secret
await client.webhooks.rotateSecret('webhook_xxxxx');
```

## Compliance

Veil Mail has built-in email compliance features for marketing emails.

### Email Types

Set the `type` field to classify your emails:

```typescript
// Marketing email — automatically gets compliance features
await client.emails.send({
  from: 'news@yourdomain.com',
  to: 'subscriber@example.com',
  subject: 'Monthly Newsletter',
  html: '<h1>Updates</h1>',
  type: 'marketing', // Adds unsubscribe headers, footer, enforces physical address
});

// Transactional email (default) — no compliance overhead
await client.emails.send({
  from: 'orders@yourdomain.com',
  to: 'customer@example.com',
  subject: 'Order #1234 Confirmed',
  html: '<h1>Order confirmed</h1>',
  // type defaults to 'transactional'
});
```

### Marketing Email Features

When `type: 'marketing'` is set:
- **List-Unsubscribe headers** are added automatically (RFC 2369 + RFC 8058)
- **Unsubscribe footer** is appended to the HTML with your physical address
- **Physical address** is required (configure in dashboard Settings)
- **Suppression check** blocks sends to bounced/unsubscribed/complained addresses

### Pre-Send Suppression Check

All emails (transactional and marketing) are checked against the suppression list. If a recipient is suppressed, the API returns a `422` with error code `recipient_suppressed`:

```typescript
try {
  await client.emails.send({ ... });
} catch (error) {
  if (error instanceof VeilMailError && error.code === 'recipient_suppressed') {
    console.log('Suppressed:', error.details.suppressedRecipients);
  }
}
```

## Error Handling

The SDK provides typed errors for different scenarios:

```typescript
import {
  VeilMail,
  VeilMailError,
  AuthenticationError,
  ValidationError,
  PiiDetectedError,
  RateLimitError,
} from '@resonia/veilmail-sdk';

try {
  await client.emails.send({ ... });
} catch (error) {
  if (error instanceof PiiDetectedError) {
    console.log('PII detected:', error.piiTypes);
  } else if (error instanceof RateLimitError) {
    console.log('Rate limited, retry after:', error.retryAfter);
  } else if (error instanceof ValidationError) {
    console.log('Validation error:', error.message);
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof VeilMailError) {
    console.log('API error:', error.code, error.message);
  }
}
```

## Configuration

```typescript
const client = new VeilMail({
  apiKey: 'veil_live_xxxxx',
  baseUrl: 'https://api.veilmail.xyz', // Optional
  timeout: 30000, // Optional, in milliseconds
});
```

## Requirements

- Node.js 18+ (uses native `fetch`)

## Framework Setup

### Next.js 16+ (Turbopack)

When using with Next.js 16 and Turbopack, add the SDK to `transpilePackages` in your `next.config.ts`:

```typescript
const nextConfig = {
  transpilePackages: ['@resonia/veilmail-sdk'],
  // ... other config
};
```

### Monorepo / Local Development

If linking the SDK locally in a monorepo, use `file:` protocol instead of `link:` for better Turbopack compatibility:

```json
{
  "dependencies": {
    "@resonia/veilmail-sdk": "file:../path/to/sdk"
  }
}
```

## Migrating from Resend

If you're migrating from Resend, note these API differences:

| Resend | Veil Mail |
|--------|-----------|
| `{ data, error }` return pattern | Direct return, throws on error |
| `resend.emails.send()` | `client.emails.send()` |
| Manual PII handling | Automatic PII scanning |

```typescript
// Resend pattern
const { data, error } = await resend.emails.send({ ... });
if (error) { /* handle */ }

// Veil Mail pattern (cleaner)
try {
  const email = await client.emails.send({ ... });
} catch (error) {
  // Handle typed errors
}
```

## Troubleshooting

**Package not found after publishing?**
npm registry propagation can take a few minutes. Wait 2-5 minutes and try again.

**Turbopack build errors?**
Make sure you've added `@resonia/veilmail-sdk` to `transpilePackages` in your Next.js config.

## License

MIT - See [LICENSE](./LICENSE) for details.
