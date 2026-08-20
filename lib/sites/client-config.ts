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
 */
export type ClientConfig = {
  businessName: string
  description: string
  address?: string
  phone?: string
  hours?: string // human-readable, e.g. "Mon-Fri 9:00 AM - 5:00 PM"
  website?: string
}

export function getClientConfigPath(storename: string): string {
  return path.join(process.cwd(), "clients", storename, "config.json")
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

  return parsed as ClientConfig
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
