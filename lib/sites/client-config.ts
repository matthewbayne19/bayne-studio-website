import fs from "node:fs"
import path from "node:path"

/**
 * clients/<storename>/config.json shape.
 *
 * businessName + description: written by you, describes the vibe/personality
 *   you want the site to have - this is subjective, a Places API lookup
 *   can't give you this.
 * address/phone/hours/website: hard facts, meant to be filled in by
 *   scripts/lookup-business.ts from Google Places (the authoritative
 *   source - business owners keep this updated directly on their Google
 *   Business Profile). All optional, since a client config can exist
 *   before a lookup has been run, or if lookup finds nothing.
 * instagram/etsy/sellsAt: for businesses without a storefront or website -
 *   makers, vendors, market/craft-show sellers. All optional.
 * aboutCreator: for solo/maker businesses where the founder's story is
 *   itself part of the pitch. Optional - most businesses won't need this.
 */
export type AboutCreatorSection = {
  sectionTitle: string
  content: string
}

export type ClientConfig = {
  businessName: string
  description: string
  address?: string
  phone?: string
  hours?: string // human-readable, e.g. "Mon-Fri 9:00 AM - 5:00 PM"
  website?: string
  instagram?: string
  etsy?: string
  sellsAt?: string // e.g. "Local craft shows and markets across the tri-state area"
  aboutCreator?: AboutCreatorSection
}

export function getClientConfigPath(storename: string): string {
  return path.join(process.cwd(), "clients", storename, "config.json")
}

/**
 * Replaces em dashes and double hyphens with a period. This is exactly the
 * pattern we tell v0 never to use in its OWN output - if input text (a
 * description, an about-creator blurb) already contains it, there's a real
 * risk v0 mirrors that formatting despite the instruction. Best-effort
 * cleanup, not a full grammar rewrite - logs when it changes something so
 * this isn't a silent, invisible mutation of what you wrote.
 */
function sanitizeDashes(text: string, fieldLabel: string): string {
  const cleaned = text.replace(/\s*(--|—)\s*/g, ". ").replace(/\.\s*\./g, ".")
  if (cleaned !== text) {
    console.log(`  Note: cleaned em dash/double hyphen out of "${fieldLabel}" (v0 is instructed never to use these).`)
  }
  return cleaned
}

function sanitizeConfig(config: ClientConfig): ClientConfig {
  const sanitized: ClientConfig = { ...config, description: sanitizeDashes(config.description, "description") }
  if (sanitized.aboutCreator) {
    sanitized.aboutCreator = {
      ...sanitized.aboutCreator,
      content: sanitizeDashes(sanitized.aboutCreator.content, "aboutCreator.content"),
    }
  }
  return sanitized
}

export function loadClientConfig(storename: string): ClientConfig {
  const configPath = getClientConfigPath(storename)
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No config found at clients/${storename}/config.json. Create that file with { "businessName": "...", "description": "..." } first.`,
    )
  }

  const raw = fs.readFileSync(configPath, "utf-8")
  const parsed = JSON.parse(raw)

  if (!parsed.businessName || !parsed.description) {
    throw new Error(`clients/${storename}/config.json must have both "businessName" and "description".`)
  }

  return sanitizeConfig(parsed as ClientConfig)
}

/**
 * Merges new fields into an existing config (or creates one if none
 * exists yet), preserving anything already there. Used by
 * lookup-business.ts so it never clobbers a description you already wrote.
 */
export function saveClientConfig(storename: string, updates: Partial<ClientConfig>): ClientConfig {
  const configPath = getClientConfigPath(storename)
  const dir = path.dirname(configPath)
  fs.mkdirSync(dir, { recursive: true })

  const existing: Partial<ClientConfig> = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : {}

  const merged = { ...existing, ...updates } as ClientConfig
  fs.writeFileSync(configPath, JSON.stringify(merged, null, 2))
  return merged
}
