/**
 * Usage:
 *   npx tsx scripts/generate-site-v0.ts example-antiques
 *
 * Reads clients/<storename>/config.json for businessName + description,
 * and uploads every image in clients/<storename>/photos/ to Vercel Blob
 * automatically, passing the resulting URLs to v0 as attachments. Name
 * photo files descriptively (storefront.jpg, interior-1.jpg) since the
 * filename becomes the label that tells v0 what each photo shows.
 *
 * Requires V0_API_KEY (v0.app -> settings -> API keys) and, if the client
 * has a photos/ folder, BLOB_READ_WRITE_TOKEN (Vercel dashboard -> Storage
 * -> create a Blob store -> connect to this project).
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
import { uploadClientPhotos } from "../lib/sites/upload-photos"
import { loadClientConfig, type ClientConfig } from "../lib/sites/client-config"

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
- Never use em dashes (—) or double hyphens (--) anywhere in the site's written copy. Use periods,
  commas, or parentheses instead. This is one of the most common tells that text was AI-generated,
  and undermines the "genuinely professional, not generic" goal above.
- Design mobile-first, not just "responsive." Most prospects will open this link on their phone, not
  a laptop, so mobile is the primary experience to get right, not an afterthought pass on a desktop
  design. Specifically: no horizontal scrolling or overflow at any width; tap targets (buttons, links)
  at least 44px tall; hero text sized so headlines don't force awkward wrapping on a 375px-wide screen;
  images and galleries that reflow to a single column on mobile rather than staying multi-column and
  shrinking illegibly; a nav that collapses sensibly (hamburger menu or similar) rather than cramming
  every link into a shrunk header.
- In the footer, include a small site-credit line naming Bayne Studio (e.g. "Site design by
  Bayne Studio" or similar wording is fine to vary). The words "Bayne Studio" specifically must
  always be a real anchor link (<a href="https://baynestudio.com">) to https://baynestudio.com,
  not plain unlinked text. This is a strict, non-negotiable requirement, not a stylistic
  suggestion - every generated site must include this working link, exactly as specified.
`.trim()

function buildPrompt(clientConfig: ClientConfig, photos: { label: string }[]): string {
  const { businessName, description, address, phone, hours, website, instagram, etsy, sellsAt, aboutCreator } =
    clientConfig

  const photoGuidance =
    photos.length > 0
      ? `\n\nAttached photos, in this order: ${photos.map((p, i) => `${i + 1}. ${p.label}`).join(", ")}. Use your judgment on where each fits best based on its label (e.g. a photo labeled "storefront" likely belongs in the hero, "interior" or a product name likely belongs in a gallery/story section).`
      : ""

  const facts = [
    address && `Address: ${address}`,
    phone && `Phone: ${phone}`,
    hours && `Hours: ${hours}`,
    website && `Existing website: ${website}`,
    instagram && `Instagram: ${instagram}`,
    etsy && `Etsy shop: ${etsy}`,
    sellsAt && `Where sold / found in person: ${sellsAt}`,
  ].filter(Boolean)
  const factsBlock =
    facts.length > 0
      ? `\n\nReal business details (use these exactly, verbatim - do not invent or alter any of this):\n${facts.join("\n")}`
      : "\n\nNo verified address/phone/hours available - do not invent placeholder contact info; leave those fields out of the design rather than making something up."

  const aboutCreatorBlock = aboutCreator
    ? `\n\nInclude a section titled roughly "${aboutCreator.sectionTitle}" (exact wording can vary slightly for flow) built from this real content - you may paraphrase lightly for tone, but keep the substance and warmth intact, and do not invent additional biographical details beyond what's given here:\n"${aboutCreator.content}"`
    : ""

  return `${BRAND_GUIDANCE}

Build a single-page demo website for this business:

Business name: ${businessName}
Description: ${description}${factsBlock}${aboutCreatorBlock}${photoGuidance}

This is a sales demo a web design studio (Bayne Studio) is sending to this business to win
them as a client — it needs to look genuinely professional and tailored to them specifically,
not generic.`
}

async function generateSite(storename: string) {
  const clientConfig = loadClientConfig(storename)
  const { businessName, description } = clientConfig

  // Refuse to burn an API call on a description that was never actually
  // written - this is exactly what happened with Simon Vintage: the
  // lookup-business.ts placeholder went out as real input, and v0 had
  // nothing meaningful to build from.
  if (description.trim().toUpperCase().startsWith("TODO")) {
    throw new Error(
      `clients/${storename}/config.json still has a placeholder description. Write a real one (what the business does, its personality/vibe) before generating.`,
    )
  }

  console.log(`Checking for photos in clients/${storename}/photos/...`)
  const photos = await uploadClientPhotos(storename)
  console.log(photos.length > 0 ? `Uploaded ${photos.length} photo(s).` : `No photos found - proceeding without.`)

  const prompt = buildPrompt(clientConfig, photos)

  // Using createAsync + polling instead of the synchronous create() call.
  // create() holds one HTTP connection open for the entire generation,
  // which can run for several minutes on a multi-section site - long
  // enough to hit timeouts on v0's own infrastructure (UND_ERR_SOCKET,
  // "other side closed"), not just our client. createAsync queues the job
  // and returns immediately; we then poll a separate, fast status check
  // instead of keeping one fragile long-lived connection open.
  const queued = await v0.chats.createAsync({
    message: prompt,
    attachments: photos.map((p) => ({ url: p.url })),
  })
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

    // tool-calls means the agent used a tool and is now waiting on
    // something - in practice this often means it hit a snag (like a
    // failed scrape attempt) and is asking YOU a clarifying question
    // directly in v0's chat UI. This is not completion, even though
    // finishReason is set - treating it as success is what caused
    // "Chat has no previewable files" to look like a mystery instead of
    // an expected state. Stop polling and tell you to go answer it.
    if (finishReason === "tool-calls") {
      console.log(`\nv0 is waiting for input, not finished generating.`)
      console.log(
        `Go to https://v0.app and open the "${businessName}" chat (id ${chatId}) - it likely asked a clarifying question (e.g. it may have tried to research the business and hit a snag) that needs answering before it continues.`,
      )
      console.log(`Once you've answered there, re-run this script or use refine-site.ts against chat ${chatId}.`)
      return
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

const [, , storename] = process.argv
if (!storename) {
  console.error("Usage: npx tsx scripts/generate-site-v0.ts <storename>")
  console.error(`(expects clients/<storename>/config.json to exist)`)
  process.exit(1)
}

generateSite(storename).catch((err) => {
  console.error(err)
  process.exit(1)
})
