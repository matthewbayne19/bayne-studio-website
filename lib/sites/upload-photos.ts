import fs from "node:fs"
import path from "node:path"
import { put } from "@vercel/blob"

export type UploadedPhoto = {
  url: string
  label: string // human-readable, derived from filename - tells v0 what the photo is
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

/**
 * Converts a filename like "02-antique-desk.jpg" into a readable label
 * like "antique desk" - strips extension and any leading numeric ordering
 * prefix, replaces separators with spaces. Name your files descriptively
 * (storefront.jpg, interior-1.jpg) since this label is what tells v0 what
 * each photo actually shows.
 */
function labelFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "")
  const withoutOrderPrefix = withoutExt.replace(/^\d+[-_]?/, "")
  return withoutOrderPrefix.replace(/[-_]+/g, " ").trim()
}

/**
 * Uploads every image in clients/<storename>/photos/ to Vercel Blob under
 * a client-specific path, and returns their public URLs with labels.
 * Returns an empty array (not an error) if the client has no photos folder
 * yet - photos are optional, not required, for a generation to proceed.
 */
export async function uploadClientPhotos(storename: string): Promise<UploadedPhoto[]> {
  const photosDir = path.join(process.cwd(), "clients", storename, "photos")

  if (!fs.existsSync(photosDir)) {
    return []
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in your Vercel dashboard (Storage tab), connect it to this project, and add the token to .env.local.",
    )
  }

  const files = fs
    .readdirSync(photosDir)
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort() // numeric prefixes (01-, 02-) control ordering here

  const uploaded: UploadedPhoto[] = []

  for (const filename of files) {
    const filePath = path.join(photosDir, filename)
    const buffer = fs.readFileSync(filePath)
    const blobPath = `clients/${storename}/${filename}`

    console.log(`  Uploading ${filename}...`)
    const result = await put(blobPath, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false, // keep predictable, human-readable URLs
    })

    uploaded.push({ url: result.url, label: labelFromFilename(filename) })
  }

  return uploaded
}
