import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllStorenames, getChatRecord } from "@/lib/sites/get-chat"

type PageProps = {
  params: Promise<{ storename: string }>
}

// Not statically generated (unlike the old JSON-driven version) — the
// underlying v0 preview can change between visits as you refine a chat,
// so this route is dynamic by nature. That's expected and fine for a
// low-traffic sales-demo page.
export async function generateStaticParams() {
  return getAllStorenames().map((storename) => ({ storename }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { storename } = await params
  const record = getChatRecord(storename)

  if (!record) {
    return { title: "Not found" }
  }

  return {
    title: `${record.businessName} — Preview`,
    robots: { index: false, follow: false },
  }
}

export default async function StorePage({ params }: PageProps) {
  const { storename } = await params
  const record = getChatRecord(storename)

  if (!record) {
    notFound()
  }

  return (
    <iframe
      src={`/api/v0-preview/${record.chatId}/`}
      className="h-full w-full border-0"
      title={`${record.businessName} preview`}
    />
  )
}
