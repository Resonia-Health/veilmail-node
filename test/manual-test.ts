/**
 * Manual SDK Testing Script
 *
 * Run this to test the SDK against a local or production API:
 *
 *   # Test against local API
 *   API_URL=http://localhost:3001 API_KEY=veil_live_xxx bun -F @resonia/veilmail-sdk test:manual
 *
 *   # Test against production (with email sending)
 *   API_URL=https://api.veilmail.xyz \
 *   API_KEY=veil_live_xxx \
 *   FROM_EMAIL=hello@yourdomain.com \
 *   TEST_EMAIL=recipient@example.com \
 *   bun -F @resonia/veilmail-sdk test:manual
 */

import { VeilMail } from '../src/index.js'

const API_URL = process.env.API_URL || 'http://localhost:3001'
const API_KEY = process.env.API_KEY || 'veil_live_demo_key_for_testing'
const FROM_EMAIL = process.env.FROM_EMAIL || 'test@example.com'

async function main() {
  console.log('🧪 Veil Mail SDK Manual Test')
  console.log('============================')
  console.log(`API URL: ${API_URL}`)
  console.log(`API Key: ${API_KEY.slice(0, 15)}...`)
  console.log(`From: ${FROM_EMAIL}`)
  console.log('')

  const client = new VeilMail({
    apiKey: API_KEY,
    baseUrl: API_URL,
  })

  // Test 1: List emails
  console.log('📧 Test 1: List emails')
  try {
    const emails = await client.emails.list({ limit: 5 })
    console.log(`   ✅ Found ${emails.data.length} emails (hasMore: ${emails.hasMore})`)
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`)
  }

  // Test 2: List templates
  console.log('📝 Test 2: List templates')
  try {
    const templates = await client.templates.list({ limit: 5 })
    console.log(`   ✅ Found ${templates.data.length} templates`)
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`)
  }

  // Test 3: List domains
  console.log('🌐 Test 3: List domains')
  try {
    const domains = await client.domains.list()
    console.log(`   ✅ Found ${domains.data.length} domains`)
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`)
  }

  // Test 4: List audiences
  console.log('👥 Test 4: List audiences')
  try {
    const audiences = await client.audiences.list()
    console.log(`   ✅ Found ${audiences.data.length} audiences`)
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`)
  }

  // Test 5: List campaigns
  console.log('📣 Test 5: List campaigns')
  try {
    const campaigns = await client.campaigns.list({ limit: 5 })
    console.log(`   ✅ Found ${campaigns.data.length} campaigns`)
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`)
  }

  // Test 6: List webhooks
  console.log('🔗 Test 6: List webhooks')
  try {
    const webhooks = await client.webhooks.list()
    console.log(`   ✅ Found ${webhooks.data.length} webhooks`)
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`)
  }

  // Test 7: Send a test email (only if TEST_EMAIL is set)
  const testEmail = process.env.TEST_EMAIL
  if (testEmail) {
    console.log(`📤 Test 7: Send test email to ${testEmail}`)
    try {
      const email = await client.emails.send({
        from: FROM_EMAIL,
        to: testEmail,
        subject: 'SDK Test Email',
        html: '<h1>Hello from Veil Mail SDK!</h1><p>This is a test email sent via the SDK.</p>',
      })
      console.log(`   ✅ Email sent: ${email.id} (status: ${email.status})`)
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'details' in error) {
        console.log(`   ❌ Failed: ${(error as Error).message}`)
        console.log(`   Details:`, JSON.stringify((error as { details?: unknown }).details, null, 2))
      } else {
        console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`)
      }
    }
  } else {
    console.log('📤 Test 7: Send email (SKIPPED - set TEST_EMAIL and FROM_EMAIL env vars to enable)')
  }

  console.log('')
  console.log('✨ Tests complete!')
}

main().catch(console.error)
