export async function GET(request: Request, { params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params

  return new Response(
    `<!doctype html>
<html>
<head>
  <meta http-equiv="refresh" content="2;url=/api/v0-preview/${chatId}/" />
</head>
<body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#666;">
  Loading preview… (checking again every couple seconds)
</body>
</html>`,
    { headers: { "Content-Type": "text/html" } },
  )
}
