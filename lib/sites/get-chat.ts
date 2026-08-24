import fs from "node:fs"
import path from "node:path"
import { chatRecordSchema, type ChatRecord } from "./schema"
import { isValidStorename } from "./client-config"

const CHATS_DIR = path.join(process.cwd(), "content", "chats")

export function getChatRecord(storename: string): ChatRecord | null {
  // Reject before it ever becomes part of a filesystem path - closes path
  // traversal structurally rather than relying on Next.js routing behavior
  // to prevent it, which is real but external to this codebase.
  if (!isValidStorename(storename)) return null

  const filePath = path.join(CHATS_DIR, `${storename}.json`)
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return chatRecordSchema.parse(JSON.parse(raw))
  } catch (err) {
    console.error(`[get-chat] Failed to load "${storename}":`, err)
    return null
  }
}

export function getAllStorenames(): string[] {
  if (!fs.existsSync(CHATS_DIR)) return []
  return fs
    .readdirSync(CHATS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
}

export function saveChatRecord(record: ChatRecord): void {
  fs.mkdirSync(CHATS_DIR, { recursive: true })
  const filePath = path.join(CHATS_DIR, `${record.storename}.json`)
  fs.writeFileSync(filePath, JSON.stringify(chatRecordSchema.parse(record), null, 2))
}

/**
 * SECURITY: the /api/v0-preview/[chatId] route is reachable directly by
 * anyone, not just through a /[storename] page — so it must never trust a
 * chatId that didn't come from our own records. This allowlist is checked
 * before that route calls the v0 API or reflects the chatId into any HTML,
 * which closes both the free-riding/cost-abuse angle (only real, intended
 * demo chats can be proxied) and the XSS angle (only clean, known-safe IDs
 * we generated ourselves ever reach the page).
 *
 * Deliberately NOT cached across calls. generate-site-v0.ts, refine-site.ts,
 * and link-chat.ts all run as separate Node processes from the running dev
 * server (or a warm Vercel function in production) - nothing in one process
 * can invalidate an in-memory cache living in another. A cached version of
 * this check will always eventually 404 a client that was genuinely just
 * added, until the server process restarts. Reading a handful of small JSON
 * files fresh on every check is cheap enough at this scale that caching
 * isn't worth the staleness risk.
 */
export function isKnownChatId(chatId: string): boolean {
  return getAllStorenames().some((s) => getChatRecord(s)?.chatId === chatId)
}
