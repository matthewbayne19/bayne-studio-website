import fs from "node:fs"
import path from "node:path"
import { z } from "zod"

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
const aboutCreatorSchema = z.object({
  sectionTitle: z.string(),
  content: z.string(),
})
export type AboutCreatorSection = z.infer<typeof aboutCreatorSchema>

const clientConfigSchema = z
  .object({
    businessName: z.string().min(1),
    description: z.string().min(1),
    address: z.string().optional(),
    phone: z.string().optional(),
    hours: z.string().optional(),
    website: z.string().optional(),
    instagram: z.string().optional(),
    etsy: z.string().optional(),
    sellsAt: z.string().optional(),
    aboutCreator: aboutCreatorSchema.optional(),
  })
  // passthrough (not strict): keeps any extra fields you add ahead of the
  // schema catching up, while still catching real mistakes - e.g. a typo'd
  // field name doesn't get silently dropped the way a plain `as` cast did,
  // and a missing required field now fails loudly with a clear message
  // instead of reaching v0 with an unexpected shape.
  .passthrough()

export type ClientConfig = z.infer<typeof clientConfigSchema>

/**
 * Storenames become both a public URL segment and a filesystem path
 * component (content/chats/<storename>.json). This is the single place
 * that decides what's a legal storename - enforced both when generating
 * (fail fast, don't waste an API call on a name that will never resolve)
 * and when loading a chat record (closes off path traversal structurally,
 * rather than relying on Next.js routing behavior to prevent it).
 */
const STORENAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/
const RESERVED_STORENAMES = new Set([
  "about",
  "admin",
  "api",
  "blog",
  "contact",
  "legal",
  "privacy",
  "pricing",
  "services",
  "terms",
])

export function isValidStorename(storename: string): boolean {
  return STORENAME_PATTERN.test(storename) && !RESERVED_STORENAMES.has(storename)
}

export function assertValidStorename(storename: string): void {
  if (!isValidStorename(storename)) {
    throw new Error(
      `"${storename}" is not a valid storename. Must be lowercase letters, numbers, and hyphens only ` +
        `(no leading/trailing hyphen), and can't be a reserved word (${[...RESERVED_STORENAMES].join(", ")}).`,
    )
  }
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
  assertValidStorename(storename)

  const configPath = getClientConfigPath(storename)
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No config found at clients/${storename}/config.json. Create that file with { "businessName": "...", "description": "..." } first.`,
    )
  }

  const raw = fs.readFileSync(configPath, "utf-8")
  const parsed = JSON.parse(raw)

  // Real validation, not a type-only cast - a typo'd field name or a
  // missing required field now fails loudly here instead of silently
  // reaching v0 with an unexpected shape.
  const result = clientConfigSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error(
      `clients/${storename}/config.json failed validation: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    )
  }

  return sanitizeConfig(result.data)
}

/**
 * Merges new fields into an existing config (or creates one if none
 * exists yet), preserving anything already there. Used by
 * lookup-business.ts so it never clobbers a description you already wrote.
 */
export function saveClientConfig(storename: string, updates: Partial<ClientConfig>): ClientConfig {
  assertValidStorename(storename)

  const configPath = getClientConfigPath(storename)
  const dir = path.dirname(configPath)
  fs.mkdirSync(dir, { recursive: true })

  const existing: Partial<ClientConfig> = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : {}

  const merged = clientConfigSchema.parse({ ...existing, ...updates })
  fs.writeFileSync(configPath, JSON.stringify(merged, null, 2))
  return merged
}
