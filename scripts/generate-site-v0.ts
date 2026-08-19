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

  const result = await v0.chats.create({ message: prompt })
  if (result.error) {
    // Log the full error object, not just .message — "fetch failed" alone
    // hides the actual cause (DNS, TLS, timeout, etc). This gives you
    // something to actually debug instead of a dead end.
    console.error("Full v0 error object:", JSON.stringify(result.error, null, 2))
    throw new Error(`v0 chat creation failed: ${result.error.message}`)
  }

  const chat = result.data.chat

  saveChatRecord({
    storename,
    businessName,
    chatId: chat.id,
    status: "demo",
    vercelProjectId: null,
    createdAt: new Date().toISOString(),
    deployedAt: null,
    sourceDescription: description,
  })

  console.log(`Created v0 chat ${chat.id} for "${businessName}"`)
  console.log(`Preview locally at http://localhost:3000/${storename}`)
  console.log(`Next: git add content/chats/${storename}.json, commit, push -> live at baynestudio.com/${storename}`)
  console.log(``)
  console.log(`To refine this site further, use scripts/refine-site.ts with chat ID ${chat.id}`)
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
