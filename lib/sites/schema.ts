import { z } from "zod"

/**
 * CHAT RECORD SCHEMA — v0-API pivot
 * ---------------------------------------------------------------
 * The actual site content/design no longer lives in our repo as
 * JSON + components — it lives inside a v0 chat, generated and
 * hosted by v0 itself. Our repo only tracks the mapping from a
 * storename slug to that chat, plus lead status.
 *
 * status: "demo"      -> chat exists, being shown to a prospect,
 *                         served at baynestudio.com/storename via
 *                         an embedded preview
 *         "deployed"   -> client bought, chat has been deployed to
 *                         its own standalone Vercel project
 *                         (vercelProjectId set), ready for their
 *                         custom domain
 */
export const chatRecordSchema = z.object({
  storename: z.string(),
  businessName: z.string(),
  chatId: z.string(),
  status: z.enum(["demo", "deployed"]),
  vercelProjectId: z.string().nullable(),
  createdAt: z.string(),
  deployedAt: z.string().nullable(),
  sourceDescription: z.string(),
})

export type ChatRecord = z.infer<typeof chatRecordSchema>
