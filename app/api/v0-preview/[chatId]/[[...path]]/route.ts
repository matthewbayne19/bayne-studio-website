import { fetchPreview, createV0Client } from "v0"

// Next.js loads .env.local into process.env before any app code runs (via
// @next/env, outside the normal module-import graph), so the default `v0`
// singleton would actually work fine here — unlike in the standalone
// scripts under scripts/, where ES module import hoisting causes it to read
// an empty env. Using createV0Client explicitly anyway, so the whole
// codebase follows one consistent, unambiguous pattern for auth.
const v0 = createV0Client({ auth: process.env.V0_API_KEY! })

type Params = { chatId: string; path: string[] }

/**
 * The proxied HTML/CSS references its own assets with root-absolute paths
 * (e.g. href="/_next/static/..."). When the browser loads our page at
 * /api/v0-preview/<chatId>/, it resolves those against localhost:3000
 * directly - completely bypassing our proxy route, since that request
 * never contains a chatId at all. This rewrites href=, src=, and CSS
 * url() references that start with exactly one "/" (not "//", which is
 * protocol-relative and already safe) to include our proxy prefix.
 */
async function rewriteAbsolutePaths(response: Response, prefix: string): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? ""
  const isRewritable = contentType.includes("text/html") || contentType.includes("text/css")
  if (!isRewritable) return response

  const text = await response.text()
  const rewritten = text
    .replace(/((?:href|src)=["'])\/(?!\/)/g, `$1${prefix}/`)
    .replace(/(url\(["']?)\/(?!\/)/g, `$1${prefix}/`)

  const headers = new Headers(response.headers)
  headers.delete("content-length") // body length changed, let the runtime recompute framing

  return new Response(rewritten, { status: response.status, statusText: response.statusText, headers })
}

async function handler(request: Request, { params }: { params: Promise<Params> }) {
  const { chatId, path } = await params

  try {
    if (!process.env.V0_API_KEY) {
      console.error("[v0-preview] V0_API_KEY is not set in this server process")
      return new Response("Server misconfigured: V0_API_KEY missing", { status: 500 })
    }

    const result = await v0.chats.getPreview({ chatId })
    if (result.error) {
      console.error("[v0-preview] getPreview returned an error:", JSON.stringify(result.error, null, 2))
      return new Response(`Preview unavailable: ${result.error.message}`, { status: 502 })
    }

    // Per the SDK's actual type, a successful response can still be `null`
    // while the sandbox is still starting up - that's expected, not an
    // error, and fetchPreview's fallbackUrl handles it (shows the loading
    // page). Treating this as an error would be its own separate bug.
    const previewResponse = await fetchPreview({
      request,
      preview: result.data,
      path,
      fallbackUrl: `/api/v0-preview/${chatId}/loading`,
    })

    return await rewriteAbsolutePaths(previewResponse, `/api/v0-preview/${chatId}`)
  } catch (err) {
    // This is the branch that was silently becoming a bare 500 before —
    // now the real exception prints here, in the terminal running `npm run dev`.
    console.error("[v0-preview] Unhandled exception in preview route:", err)
    return new Response(`Preview route error: ${err instanceof Error ? err.message : String(err)}`, {
      status: 500,
    })
  }
}

export const GET = handler
export const POST = handler
