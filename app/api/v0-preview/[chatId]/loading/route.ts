export async function GET(request: Request, { params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params
  const url = new URL(request.url)
  const name = url.searchParams.get("name") ?? ""
  const nameQuery = name ? `?name=${encodeURIComponent(name)}` : ""
  const displayName = name || "your site"

  return new Response(
    `<!doctype html>
<html>
<head>
  <meta http-equiv="refresh" content="2;url=/api/v0-preview/${chatId}/${nameQuery}" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #fafaf9 0%, #f0ede8 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #292524;
      opacity: 0;
      animation: fadeIn 0.4s ease-out forwards;
    }

    @keyframes fadeIn {
      to { opacity: 1; }
    }

    .card {
      text-align: center;
      padding: 3rem 2.5rem;
    }

    .mark {
      width: 56px;
      height: 56px;
      margin: 0 auto 1.75rem;
      position: relative;
    }

    .mark::before, .mark::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2.5px solid transparent;
      border-top-color: #d97757;
    }

    .mark::before {
      animation: spin 1.1s linear infinite;
    }

    .mark::after {
      border-top-color: transparent;
      border: 2.5px solid #e7e2db;
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
      font-size: 0.9rem;
      color: #78716c;
    }

    .dots span {
      display: inline-block;
      animation: pulse 1.4s ease-in-out infinite;
      opacity: 0.2;
    }

    .dots span:nth-child(2) { animation-delay: 0.2s; }
    .dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes pulse {
      0%, 80%, 100% { opacity: 0.2; }
      40% { opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="mark"></div>
    <h1>Preparing ${escapeHtml(displayName)}</h1>
    <p>Just a moment<span class="dots"><span>.</span><span>.</span><span>.</span></span></p>
  </div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html" } },
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
