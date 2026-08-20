import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

export type LegalSection = {
  id: string
  title: string
}

export function LegalHeader() {
  return (
    <header className="border-b border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between">
        <a href="/" className="font-display text-xl md:text-2xl tracking-tight">
          Bayne Studio
        </a>
        <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </a>
      </div>
    </header>
  )
}

export function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  sections,
  children,
}: {
  eyebrow: string
  title: string
  lastUpdated: string
  sections: LegalSection[]
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <LegalHeader />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">
        {/* Eyebrow */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            {eyebrow}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-display tracking-tight mb-4 max-w-2xl">
          {title}
        </h1>
        <p className="text-sm font-mono text-muted-foreground mb-16 md:mb-20">
          Last updated {lastUpdated}
        </p>

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* Table of contents - desktop only, sticky */}
          <nav className="hidden lg:block">
            <div className="sticky top-24">
              <span className="text-xs font-mono text-muted-foreground/70 uppercase tracking-wider mb-4 block">
                On this page
              </span>
              <ul className="space-y-3 border-l border-foreground/10">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="group flex items-start gap-3 pl-4 -ml-px border-l border-transparent hover:border-foreground/40 transition-colors py-0.5">
                      <span className="font-mono text-xs text-muted-foreground/60 pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {section.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <div className="max-w-[640px]">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-10 mb-10 border-t border-foreground/10 first:border-t-0 first:pt-0 first:mb-10">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-sm text-muted-foreground">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="text-xl md:text-2xl font-display">{title}</h2>
      </div>
      <div className="text-sm md:text-base leading-relaxed text-foreground/80 space-y-4">
        {children}
      </div>
    </section>
  )
}
