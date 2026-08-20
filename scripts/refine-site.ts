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

  // Same fix as generate-site-v0.ts and for the same reason: send() holds
  // one connection open for the entire refinement, which can be long
  // enough to hit timeouts on either end for a substantial change.
  // sendAsync queues it and returns a messageId immediately; poll that
  // instead of keeping one fragile long-lived connection open.
  const queued = await v0.messages.sendAsync({ chatId: record.chatId, message: instruction })
  if (queued.error) {
    console.error("v0 error object:", queued.error)
    console.error("Underlying cause:", (queued.error as any)?.cause)
    throw new Error(`v0 refinement failed: ${queued.error.message}`)
  }

  const { messageId } = queued.data
  console.log(`Queued refinement for "${record.businessName}" - polling for completion...`)

  const pollIntervalMs = 5000
  const maxAttempts = 120
  let attempt = 0

  while (attempt < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    attempt++

    const messageResult = await v0.messages.get({ chatId: record.chatId, messageId })
    if (messageResult.error) {
      console.error("v0 error object:", messageResult.error)
      throw new Error(`Polling failed: ${messageResult.error.message}`)
    }

    const finishReason = messageResult.data.finishReason
    process.stdout.write(`  poll ${attempt}/${maxAttempts}: finishReason=${finishReason ?? "(pending)"}\r`)

    if (finishReason === "error") {
      throw new Error("v0 reported the refinement ended in an error state")
    }

    if (finishReason) {
      console.log(`\nRefinement finished (${finishReason}) after ${attempt * (pollIntervalMs / 1000)}s`)
      console.log(`Preview at http://localhost:3000/${storename}`)
      return
    }
  }

  throw new Error(
    `Refinement didn't finish after ${(maxAttempts * pollIntervalMs) / 1000}s of polling. Check https://v0.app directly on chat ${record.chatId}.`,
  )
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
