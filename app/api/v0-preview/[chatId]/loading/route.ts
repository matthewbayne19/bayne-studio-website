import { isKnownChatId } from "@/lib/sites/get-chat"
import { checkRateLimit, getClientKey } from "@/lib/rate-limit"

// Never cache this route. It renders per-request state (retry count via
// the meta-refresh chain, the business name) and must always execute
// fresh - Next.js caches GET route handlers by default otherwise, which
// could mean seeing a stale, pre-fix response even after the code changes.
export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params

  // SECURITY: same reasoning as the main preview route - chatId is
  // untrusted input from the URL and gets reflected into HTML below, so it
  // must be a chat ID we actually generated before we do anything with it.
  if (!isKnownChatId(chatId)) {
    return new Response("Not found", { status: 404 })
  }

  const { allowed } = checkRateLimit(getClientKey(request))
  if (!allowed) {
    return new Response("Too many requests", { status: 429, headers: { "Retry-After": "60" } })
  }

  const url = new URL(request.url)
  const name = url.searchParams.get("name") ?? ""
  const nameQuery = name ? `?name=${encodeURIComponent(name)}` : ""
  const displayName = name || "your site"
  // Belt-and-suspenders: escape even though isKnownChatId already
  // guarantees this is one of our own clean IDs.
  const safeChatId = escapeHtml(chatId)

  return new Response(
    `<!doctype html>
<html>

<head>
  <meta http-equiv="refresh" content="2;url=/api/v0-preview/${safeChatId}/${nameQuery}" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* Content is visible by default - never hidden behind an animation
       that might not fire. A safe base state matters more than a fade-in. */
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #fafaf9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #292524;
    }

    .card {
      text-align: center;
      padding: 2.5rem;
      width: 100%;
      max-width: 320px;
    }

    .mark {
      width: 44px;
      height: 44px;
      margin: 0 auto 1.75rem;
      border-radius: 50%;
      border: 3px solid #e7e2db;
      border-top-color: #d97757;
      /* If this animation doesn't run for any reason, this still renders
         as a plain static ring - never invisible, just less lively. */
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    h1 {
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin-bottom: 0.4rem;
    }

    p {
      font-size: 0.85rem;
      color: #78716c;
      margin-bottom: 1.5rem;
    }

    .bar-track {
      height: 4px;
      width: 100%;
      background: #e7e2db;
      border-radius: 999px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      width: 40%;
      border-radius: 999px;
      background: #d97757;
      animation: slide 1.3s ease-in-out infinite;
    }

    @keyframes slide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(250%); }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="mark"></div>
    <h1>Preparing ${escapeHtml(displayName)}</h1>
    <p>Building your preview, just a moment</p>
    <div class="bar-track">
      <div class="bar-fill"></div>
    </div>
  </div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html", "Cache-Control": "no-store, must-revalidate" } },
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
