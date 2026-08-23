import { fetchPreview, createV0Client } from "v0"
import { isKnownChatId } from "@/lib/sites/get-chat"
import { checkRateLimit, getClientKey } from "@/lib/rate-limit"

// Next.js loads .env.local into process.env before any app code runs (via
// @next/env, outside the normal module-import graph), so the default `v0`
// singleton would actually work fine here — unlike in the standalone
// scripts under scripts/, where ES module import hoisting causes it to read
// an empty env. Using createV0Client explicitly anyway, so the whole
// codebase follows one consistent, unambiguous pattern for auth.
const v0 = createV0Client({ auth: process.env.V0_API_KEY! })

type Params = { chatId: string; path?: string[] }

// Matches the confirmed real shape of v0.chats.getPreview's 200 response.
// Defined explicitly rather than derived via Awaited<ReturnType<...>>,
// since the SDK's actual generic return type is a request/response-aware
// intersection that made type inference here more confusing than helpful.
type PreviewData = { url: string; token: string; expiresAt: Date } | null

/**
 * A single page load fires ~40-60 asset requests through this proxy, and
 * without this, every single one triggered a fresh authenticated
 * v0.chats.getPreview call - multiplying both latency and v0 API usage by
 * roughly the number of assets on the page. The preview response includes
 * its own expiresAt, which exists precisely to make this cacheable.
 */
const previewCache = new Map<string, { data: NonNullable<PreviewData>; expiresAt: number }>()

async function getCachedPreview(
  chatId: string,
): Promise<{ data: PreviewData; error: null } | { data: null; error: { message: string } }> {
  const cached = previewCache.get(chatId)
  if (cached && cached.expiresAt > Date.now()) {
    return { data: cached.data, error: null }
  }

  const result = await v0.chats.getPreview({ chatId })
  if (result.error) {
    return { data: null, error: { message: result.error.message } }
  }

  const data = result.data ?? null

  // Cache for the shorter of (until v0 says it expires) or 30s, so a
  // preview that's mid-refresh never gets stuck stale for the full
  // upstream expiry window. Only a real, non-null preview gets cached -
  // "still starting" (null) should always be checked fresh next time.
  if (data) {
    const expiresAt = Math.min(new Date(data.expiresAt).getTime(), Date.now() + 30_000)
    previewCache.set(chatId, { data, expiresAt })
  }
  return { data, error: null }
}

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

// Never cache this route at the Next.js/framework level - it proxies live,
// per-request state from v0's sandbox and must always execute fresh. (This
// is separate from the previewCache above, which caches the upstream v0
// API call specifically, not the route's own output.)
export const dynamic = "force-dynamic"

async function handler(request: Request, { params }: { params: Promise<Params> }) {
  const { chatId, path } = await params
  const requestUrl = new URL(request.url)
  const name = requestUrl.searchParams.get("name") ?? ""
  const nameQuery = name ? `?name=${encodeURIComponent(name)}` : ""

  // SECURITY: chatId is untrusted input from a public URL, reachable
  // directly (not only through a /[storename] page). Without this check,
  // this route becomes an open, API-key-authenticated proxy into ANY v0
  // chat the key can access, not just this studio's own client demos.
  if (!isKnownChatId(chatId)) {
    return new Response("Not found", { status: 404 })
  }

  const { allowed } = checkRateLimit(getClientKey(request))
  if (!allowed) {
    return new Response("Too many requests", { status: 429, headers: { "Retry-After": "60" } })
  }

  try {
    if (!process.env.V0_API_KEY) {
      // Real cause logged server-side only - see note on error responses below.
      console.error("[v0-preview] V0_API_KEY is not set in this server process")
      return new Response("Preview temporarily unavailable", { status: 500 })
    }

    const result = await getCachedPreview(chatId)
    if (result.error) {
      console.error("[v0-preview] getPreview returned an error:", JSON.stringify(result.error, null, 2))
      // Generic message to the public response; full detail stays server-side
      // only, in logs. Returning result.error.message directly here would leak
      // upstream/internal error text to any visitor.
      return new Response("Preview temporarily unavailable", { status: 502 })
    }

    // Per the SDK's actual type, a successful response can still be `null`
    // while the sandbox is still starting up - that's expected, not an
    // error, and fetchPreview's fallbackUrl handles it (shows the loading
    // page). Treating this as an error would be its own separate bug.
    const previewResponse = await fetchPreview({
      request,
      preview: result.data,
      path,
      fallbackUrl: `/api/v0-preview/${chatId}/loading${nameQuery}`,
    })

    return await rewriteAbsolutePaths(previewResponse, `/api/v0-preview/${chatId}`)
  } catch (err) {
    // Full detail server-side only, in the terminal running `npm run dev`
    // (or Vercel's function logs in production) - never in the response body.
    console.error("[v0-preview] Unhandled exception in preview route:", err)
    return new Response("Preview temporarily unavailable", { status: 500 })
  }
}

export const GET = handler
export const POST = handler
