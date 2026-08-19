/**
 * Usage:
 *   npx tsx scripts/refine-site.ts "joes-pizza" "Make the hero image more retro, add a slice-shaped divider"
 *
 * Sends a follow-up message to the existing v0 chat for a client, continuing
 * from its current state rather than starting over. This is how you handle
 * "I love it but can you change X" feedback without regenerating from scratch.
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { Agent, setGlobalDispatcher } from "undici"

// Same reasoning as generate-site-v0.ts - refinements can also take a
// while and are subject to the same default-timeout problem.
setGlobalDispatcher(
  new Agent({
    headersTimeout: 10 * 60 * 1000,
    bodyTimeout: 10 * 60 * 1000,
  }),
)

import { createV0Client } from "v0"
import { getChatRecord } from "../lib/sites/get-chat"

const v0 = createV0Client({ auth: process.env.V0_API_KEY! })

async function refineSite(storename: string, instruction: string) {
  const record = getChatRecord(storename)
  if (!record) {
    throw new Error(`No chat record found for "${storename}" — run generate-site-v0.ts first.`)
  }

  const result = await v0.messages.send({ chatId: record.chatId, message: instruction })
  if (result.error) {
    throw new Error(`v0 refinement failed: ${result.error.message}`)
  }

  console.log(`Sent refinement to chat ${record.chatId} for "${record.businessName}"`)
  console.log(`Preview at http://localhost:3000/${storename} (may take a moment to rebuild)`)
}

const [, , storename, instruction] = process.argv
if (!storename || !instruction) {
  console.error('Usage: npx tsx scripts/refine-site.ts "<storename>" "<what to change>"')
  process.exit(1)
}

refineSite(storename, instruction).catch((err) => {
  console.error(err)
  process.exit(1)
})
