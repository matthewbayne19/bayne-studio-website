/**
 * Usage:
 *   npx tsx scripts/lookup-business.ts example-antiques "Hillsborough Antiques" "Hillsborough NJ"
 *   npx tsx scripts/lookup-business.ts example-antiques "Hillsborough Antiques" "Hillsborough NJ" "https://their-old-site.com"
 *
 * Looks up real address, phone, hours, and website via Google Places API,
 * plus Google's AI-generated place summary and a few real reviews, then
 * uses Claude to synthesize an actual description (what the business does,
 * its personality/vibe) - fully automated, no manual writing required.
 *
 * If a 4th argument (an existing site URL) is given, that site's own text
 * is fetched and used as ADDITIONAL signal for the synthesis - this is for
 * prospects who already have a site that needs a refresh: their own copy
 * is often the best signal for how they've already chosen to position
 * themselves, better than generic category/review data alone. The site's
 * text is only ever used as research input to Claude - never copied
 * verbatim into the written description, same treatment as Google reviews.
 *
 * Won't overwrite businessName/description if you've already written a
 * real one - only refreshes hard facts. Safe to re-run to update stale info.
 *
 * Requires GOOGLE_PLACES_API_KEY and ANTHROPIC_API_KEY in .env.local.
 * Note: generativeSummary and reviews are Google's "Enterprise + Atmosphere"
 * pricing tier - pricier than the basic address/phone/hours lookup, though
 * still cheap at low volume.
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import fs from "node:fs"
import Anthropic from "@anthropic-ai/sdk"
import * as cheerio from "cheerio"
import { saveClientConfig, getClientConfigPath } from "../lib/sites/client-config"

type PlacesTextSearchResponse = {
  places?: Array<{
    displayName?: { text: string }
    formattedAddress?: string
    nationalPhoneNumber?: string
    websiteUri?: string
    regularOpeningHours?: { weekdayDescriptions?: string[] }
    primaryTypeDisplayName?: { text: string }
    generativeSummary?: { overview?: { text: string } }
    reviews?: Array<{ text?: { text: string } }>
  }>
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * Fetches an existing site and extracts its visible text content (title,
 * meta description, headings, body copy), stripping script/style/nav
 * boilerplate as much as reasonably possible. Returns null on any failure
 * (site down, blocks bots, etc.) rather than throwing - an existing site
 * is a nice-to-have signal, not a required one, and the rest of the
 * lookup should proceed normally without it.
 */
async function fetchExistingSiteText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BayneStudioBot/1.0)" },
    })
    if (!response.ok) {
      console.log(`  Could not fetch ${url} (status ${response.status}) - continuing without it.`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    $("script, style, nav, footer, noscript").remove()

    const title = $("title").text().trim()
    const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? ""
    const bodyText = $("body").text().replace(/\s+/g, " ").trim()

    const combined = [title, metaDescription, bodyText].filter(Boolean).join("\n\n")
    // Cap length to keep the Claude prompt reasonable - the first couple
    // thousand characters of a homepage are almost always where the real
    // positioning/voice signal lives anyway (hero copy, about section).
    return combined.slice(0, 3000) || null
  } catch (err) {
    console.log(`  Could not fetch ${url} (${err instanceof Error ? err.message : err}) - continuing without it.`)
    return null
  }
}

/**
 * Synthesizes a real description from Google's raw signals - the AI
 * overview, a few real reviews, and the business category. This is what
 * actually removes the manual-writing step: Places gives facts and raw
 * signal, Claude turns that into usable "personality/vibe" copy.
 */
async function synthesizeDescription(
  businessName: string,
  primaryType: string | undefined,
  overview: string | undefined,
  reviewTexts: string[],
  existingSiteText: string | null,
): Promise<string> {
  const signals = [
    primaryType && `Category: ${primaryType}`,
    overview && `Google's summary: ${overview}`,
    reviewTexts.length > 0 && `Real customer reviews:\n${reviewTexts.map((r) => `- "${r}"`).join("\n")}`,
    existingSiteText &&
      `Text extracted from their EXISTING website (this is what they've already chosen to say about themselves - use it to understand their positioning, tone, and what they offer, but do NOT copy phrases verbatim; write entirely original wording):\n${existingSiteText}`,
  ]
    .filter(Boolean)
    .join("\n\n")

  if (!signals) {
    throw new Error(
      "No usable signal (no category, summary, reviews, or existing site) - can't synthesize a description. Write one manually in the config.",
    )
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Based on this real data about "${businessName}", write a 2-3 sentence description for use as input to an AI website generator. Cover what the business does/sells AND its personality/vibe (tone, character, what makes it feel distinct) - not just a factual summary. Write it as plain description text only, no preamble, no quotes around it. Do not use em dashes (—) or double hyphens (--) anywhere in the text - use periods or commas instead. If existing website text is provided below, write entirely original wording - do not reproduce phrases from it verbatim.

${signals}`,
      },
    ],
  })

  const textBlock = message.content.find((block) => block.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no usable text for the description.")
  }

  return textBlock.text.trim()
}

async function lookupBusiness(storename: string, businessName: string, city: string, existingSiteUrl?: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not set in .env.local")
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set in .env.local")
  }

  const textQuery = `${businessName}, ${city}`
  console.log(`Searching Places API for: "${textQuery}"`)

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      // Field masking is required by this API - no default field set exists.
      // generativeSummary and reviews trigger the pricier Atmosphere SKU -
      // deliberate, since that's exactly the raw material the description
      // synthesis step below needs.
      "X-Goog-FieldMask": [
        "places.displayName",
        "places.formattedAddress",
        "places.nationalPhoneNumber",
        "places.websiteUri",
        "places.regularOpeningHours.weekdayDescriptions",
        "places.primaryTypeDisplayName",
        "places.generativeSummary",
        "places.reviews",
      ].join(","),
    },
    body: JSON.stringify({ textQuery }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Places API request failed (${response.status}): ${errorText}`)
  }

  const data = (await response.json()) as PlacesTextSearchResponse
  const place = data.places?.[0]

  if (!place) {
    console.log(`No results found for "${textQuery}". Nothing written - check the name/city and try again.`)
    return
  }

  const hours = place.regularOpeningHours?.weekdayDescriptions?.join(", ")
  const primaryType = place.primaryTypeDisplayName?.text
  const overview = place.generativeSummary?.overview?.text
  const reviewTexts = (place.reviews ?? []).map((r) => r.text?.text).filter((t): t is string => Boolean(t))

  console.log(`Found: ${place.displayName?.text ?? businessName}`)
  console.log(`  Address: ${place.formattedAddress ?? "(not found)"}`)
  console.log(`  Phone: ${place.nationalPhoneNumber ?? "(not found)"}`)
  console.log(`  Website: ${place.websiteUri ?? "(not found)"}`)
  console.log(`  Hours: ${hours ?? "(not found)"}`)
  console.log(`  Category: ${primaryType ?? "(not found)"}`)
  console.log(`  Reviews found: ${reviewTexts.length}`)

  let existingSiteText: string | null = null
  if (existingSiteUrl) {
    console.log(`\nFetching existing site: ${existingSiteUrl}...`)
    existingSiteText = await fetchExistingSiteText(existingSiteUrl)
    console.log(existingSiteText ? `  Extracted ${existingSiteText.length} characters of text.` : `  No usable text extracted.`)
  }

  console.log(`\nSynthesizing description from Google's summary + reviews${existingSiteText ? " + existing site" : ""}...`)
  const description = await synthesizeDescription(businessName, primaryType, overview, reviewTexts, existingSiteText)
  console.log(`Synthesized description:\n  ${description}`)

  // Only include fields Places actually returned - never write an
  // undefined/empty value over something that might already be there.
  const updates: Record<string, string> = {}
  if (place.formattedAddress) updates.address = place.formattedAddress
  if (place.nationalPhoneNumber) updates.phone = place.nationalPhoneNumber
  if (place.websiteUri) updates.website = place.websiteUri
  if (hours) updates.hours = hours

  // businessName always gets set. description only gets set automatically
  // for a genuinely new client - if you've already written a real
  // description by hand, re-running this script won't clobber it, since
  // the whole point of being safe to re-run is refreshing facts, not
  // overwriting judgment you already exercised.
  updates.businessName = businessName
  const configPath = getClientConfigPath(storename)
  const isNewClient = !fs.existsSync(configPath)
  if (isNewClient) {
    updates.description = description
  } else {
    console.log(`(Existing config found - description left as-is. Delete it manually if you want the new one.)`)
  }

  const merged = saveClientConfig(storename, updates)

  console.log(`\nUpdated clients/${storename}/config.json:`)
  console.log(JSON.stringify(merged, null, 2))
}

const [, , storename, businessName, city, existingSiteUrl] = process.argv
if (!storename || !businessName || !city) {
  console.error(
    'Usage: npx tsx scripts/lookup-business.ts <storename> "<business name>" "<city, state>" ["<existing site URL>"]',
  )
  process.exit(1)
}

lookupBusiness(storename, businessName, city, existingSiteUrl).catch((err) => {
  console.error(err)
  process.exit(1)
})
