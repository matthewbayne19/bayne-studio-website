import fs from "node:fs"
import path from "node:path"
import { chatRecordSchema, type ChatRecord } from "./schema"

const CHATS_DIR = path.join(process.cwd(), "content", "chats")

export function getChatRecord(storename: string): ChatRecord | null {
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
 */
let knownChatIdsCache: Set<string> | null = null

export function isKnownChatId(chatId: string): boolean {
  if (!knownChatIdsCache) {
    knownChatIdsCache = new Set(getAllStorenames().map((s) => getChatRecord(s)?.chatId).filter((id): id is string => !!id))
  }
  return knownChatIdsCache.has(chatId)
}
