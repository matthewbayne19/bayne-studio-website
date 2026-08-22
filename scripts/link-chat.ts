/**
 * Usage:
 *   npx tsx scripts/link-chat.ts kenzie-keelie-studio ebeS5P51gvU
 *
 * Manually registers an existing v0 chat ID against a storename. Needed
 * when generate-site-v0.ts's poller exits early (e.g. it saw "tool-calls"
 * and stopped watching) but the chat actually went on to finish
 * successfully in v0's own UI. This writes the same record generation
 * would have written on success, without re-running generation.
 */
import { loadClientConfig } from "../lib/sites/client-config"
import { saveChatRecord } from "../lib/sites/get-chat"

const [, , storename, chatId] = process.argv
if (!storename || !chatId) {
  console.error("Usage: npx tsx scripts/link-chat.ts <storename> <chatId>")
  process.exit(1)
}

const { businessName, description } = loadClientConfig(storename)

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

console.log(`Linked chat ${chatId} to "${storename}".`)
console.log(`Preview locally at http://localhost:3000/${storename}`)
console.log(`Next: git add content/chats/${storename}.json, commit, push -> live at baynestudio.com/${storename}`)
