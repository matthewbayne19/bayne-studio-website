/**
 * Usage:
 *   npx tsx scripts/generate-site-v0.ts "joes-pizza" "Family-run pizza shop in Hillsborough NJ, dine-in and delivery, wants a classic red-and-white feel"
 *
 * Requires V0_API_KEY in your environment (get one at https://v0.app -> settings -> API keys).
 * This is a DIFFERENT key from your ANTHROPIC_API_KEY — v0's API and Claude's API are
 * separate products with separate billing. You may not need ANTHROPIC_API_KEY at all
 * for this version of the pipeline; see PROMPT_ENHANCEMENT note below.
 *
 * Unlike the old generate-site.ts, this doesn't fill a fixed schema — it sends a prompt
 * to v0's actual app-building agent and gets back a real, bespoke generated site.
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { Agent, setGlobalDispatcher } from "undici"

// Node's default fetch timeout is too short for full site generations,
// which can genuinely take several minutes for multi-section sites (this
// is what caused UND_ERR_HEADERS_TIMEOUT / "Headers Timeout Error" - Node
// gave up waiting for v0's server to respond before it actually finished
// generating). This raises that ceiling for every fetch call in this
// process, including the v0 SDK's internal ones.
setGlobalDispatcher(
  new Agent({
    headersTimeout: 10 * 60 * 1000, // 10 minutes
    bodyTimeout: 10 * 60 * 1000,
  }),
)

import { createV0Client } from "v0"
import { saveChatRecord } from "../lib/sites/get-chat"

// Built explicitly, after config() above has already run, so this always
// sees the real key — unlike the default `v0` singleton export, which
// reads process.env at import time (before our config() call gets a
// chance to run, due to how ES module imports are hoisted).
const v0 = createV0Client({ auth: process.env.V0_API_KEY! })

// Bayne Studio's house style guidance, prepended to every prompt so
// generated sites feel consistent across clients without being
// identical. Edit this as your taste/brand develops — this is the
// one place that shapes every future generation.
const BRAND_GUIDANCE = `
House style for Bayne Studio client demo sites:
- Clean, confident, modern small-business feel — never cluttered or "AI slop" looking.
- Use a single accent color derived from the business's own branding/vibe, applied
  consistently (buttons, highlights, one section background), not scattered everywhere.
- Real typographic hierarchy: one distinctive heading font pairing is welcome, but keep
  body text highly readable.
- Structure the page to fit the actual business type — a restaurant needs a menu-forward
  layout, a retail/collectibles business needs a gallery/catalog feel, a service business
  needs a clear services + booking/contact flow. Do not force every business into the same
  generic "hero, 3 features, contact" template.
- Include a hero section, a contact/hours section, and 1-2 sections specific to what the
  business actually sells or does.
- No placeholder Lorem Ipsum — write real, specific-sounding copy based on the description given.
`.trim()

function buildPrompt(businessName: string, description: string): string {
  return `${BRAND_GUIDANCE}

Build a single-page demo website for this business:

Business name: ${businessName}
Description: ${description}

This is a sales demo a web design studio (Bayne Studio) is sending to this business to win
them as a client — it needs to look genuinely professional and tailored to them specifically,
not generic.`
}

async function generateSite(storename: string, businessName: string, description: string) {
  const prompt = buildPrompt(businessName, description)

  // Using createAsync + polling instead of the synchronous create() call.
  // create() holds one HTTP connection open for the entire generation,
  // which can run for several minutes on a multi-section site - long
  // enough to hit timeouts on v0's own infrastructure (UND_ERR_SOCKET,
  // "other side closed"), not just our client. createAsync queues the job
  // and returns immediately; we then poll a separate, fast status check
  // instead of keeping one fragile long-lived connection open.
  const queued = await v0.chats.createAsync({ message: prompt })
  if (queued.error) {
    console.error("v0 error object:", queued.error)
    console.error("Underlying cause:", (queued.error as any)?.cause)
    throw new Error(`v0 chat creation failed: ${queued.error.message}`)
  }

  const { chatId, messageId } = queued.data
  console.log(`Queued generation for "${businessName}" (chat ${chatId}) - polling for completion...`)

  // Poll every 5s, up to 10 minutes total, checking finishReason on the
  // message per the SDK's own documented pattern for this exact endpoint.
  const pollIntervalMs = 5000
  const maxAttempts = 120
  let attempt = 0

  while (attempt < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    attempt++

    const messageResult = await v0.messages.get({ chatId, messageId })
    if (messageResult.error) {
      console.error("v0 error object:", messageResult.error)
      throw new Error(`Polling failed: ${messageResult.error.message}`)
    }

    const finishReason = messageResult.data.finishReason
    process.stdout.write(`  poll ${attempt}/${maxAttempts}: finishReason=${finishReason ?? "(pending)"}\r`)

    if (finishReason === "error") {
      throw new Error("v0 reported generation ended in an error state")
    }

    if (finishReason) {
      console.log(`\nGeneration finished (${finishReason}) after ${attempt * (pollIntervalMs / 1000)}s`)

      saveChatRecord({
        storename,
        businessName,
        chatId,
        status: "demo",
        vercelProjectId: null,
        createdAt: new Date().toISOString(),
        deployedAt: null,
        sourceDescription: description,
      })

      console.log(`Created v0 chat ${chatId} for "${businessName}"`)
      console.log(`Preview locally at http://localhost:3000/${storename}`)
      console.log(
        `Next: git add content/chats/${storename}.json, commit, push -> live at baynestudio.com/${storename}`,
      )
      console.log(``)
      console.log(`To refine this site further, use scripts/refine-site.ts with chat ID ${chatId}`)
      return
    }
  }

  throw new Error(
    `Generation didn't finish after ${(maxAttempts * pollIntervalMs) / 1000}s of polling. The chat (${chatId}) may still be working - check https://v0.app directly, or try scripts/refine-site.ts against it once ready.`,
  )
}

const [, , storename, businessName, description] = process.argv
if (!storename || !businessName || !description) {
  console.error(
    'Usage: npx tsx scripts/generate-site-v0.ts "<storename>" "<business name>" "<description>"',
  )
  process.exit(1)
}

generateSite(storename, businessName, description).catch((err) => {
  console.error(err)
  process.exit(1)
})
