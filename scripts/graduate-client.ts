/**
 * Usage:
 *   npx tsx scripts/graduate-client.ts "joes-pizza"
 *
 * Run this once a prospect becomes a paying client. It deploys their v0 chat
 * to its own standalone Vercel project — decoupled from baynestudio.com's repo
 * entirely — so their production site's uptime and deploys are independent of
 * your sales-demo app. After this runs, add their custom domain to the new
 * Vercel project in the dashboard.
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { createV0Client } from "v0"
import { getChatRecord, saveChatRecord } from "../lib/sites/get-chat"

const v0 = createV0Client({ auth: process.env.V0_API_KEY! })

async function graduateClient(storename: string) {
  const record = getChatRecord(storename)
  if (!record) {
    throw new Error(`No chat record found for "${storename}".`)
  }
  if (record.status === "deployed") {
    console.log(`"${storename}" is already deployed (Vercel project: ${record.vercelProjectId}).`)
    return
  }

  const projectResult = await v0.chats.createVercelProject({ chatId: record.chatId })
  if (projectResult.error) {
    throw new Error(`Failed to create Vercel project: ${projectResult.error.message}`)
  }

  const deployResult = await v0.chats.deploy({ chatId: record.chatId })
  if (deployResult.error) {
    throw new Error(`Failed to deploy: ${deployResult.error.message}`)
  }

  saveChatRecord({
    ...record,
    status: "deployed",
    vercelProjectId: projectResult.data.vercelProjectId,
    deployedAt: new Date().toISOString(),
  })

  console.log(`"${record.businessName}" deployed to its own Vercel project.`)
  console.log(`Vercel project ID: ${projectResult.data.vercelProjectId}`)
  console.log(`Deployment ID: ${deployResult.data.deploymentId}`)
  console.log(``)
  console.log(`Next: in the Vercel dashboard, add the client's custom domain to this project.`)
}

const [, , storename] = process.argv
if (!storename) {
  console.error('Usage: npx tsx scripts/graduate-client.ts "<storename>"')
  process.exit(1)
}

graduateClient(storename).catch((err) => {
  console.error(err)
  process.exit(1)
})
