import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Terms of Service — Bayne Studio",
  robots: { index: true, follow: true },
}

const sections = [
  { id: "preview-sites", title: "Preview / demo sites" },
  { id: "no-contract", title: "No contract until signed" },
  { id: "ownership", title: "Ownership" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "no-warranty", title: "No warranty" },
  { id: "changes", title: "Changes to these terms" },
  { id: "contact", title: "Contact" },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="August 2026"
      sections={sections}
    >
      <p className="text-base text-foreground/80 leading-relaxed mb-14 max-w-[560px]">
        These Terms of Service (&quot;Terms&quot;) govern your use of baynestudio.com (the
        &quot;Site&quot;), operated by Matthew Bayne LLC, doing business as Bayne Studio
        (&quot;Bayne Studio,&quot; &quot;we,&quot; &quot;us&quot;). By using the Site, you agree to
        these Terms.
      </p>

      <LegalSection id="preview-sites" number={1} title="Preview / demo sites">
        <p>
          As part of our sales process, we may build a preview website for your business and make it
          available at a temporary link on this Site (e.g. baynestudio.com/yourbusiness). These
          preview sites are:
        </p>
        <ul className="space-y-2.5 pl-5">
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            Provided solely to demonstrate what a finished site could look like — not a delivered
            product.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            Not a guarantee that we will reach an agreement to build your final site.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            Subject to removal or modification at any time, without notice.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            Not intended to be indexed by search engines or used as your live, production site.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="no-contract" number={2} title="No contract until signed">
        <p>
          Viewing a preview site, submitting our contact form, or otherwise communicating with us
          does not create a contract or obligation for either party. A project only begins once
          we&apos;ve mutually agreed on scope, price, and terms in writing.
        </p>
      </LegalSection>

      <LegalSection id="ownership" number={3} title="Ownership">
        <p>
          Preview/demo site content remains the property of Bayne Studio until a project is
          contracted and paid for. Once a final site is delivered under a signed agreement,
          ownership of that final deliverable transfers as specified in that agreement.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" number={4} title="Acceptable use">
        <p>
          You agree not to misuse the Site — including attempting to disrupt its normal operation,
          accessing it through automated means beyond normal browsing, or using it for any unlawful
          purpose.
        </p>
      </LegalSection>

      <LegalSection id="no-warranty" number={5} title="No warranty">
        <p>
          The Site and any preview content are provided &quot;as is,&quot; without warranties of any
          kind, express or implied.
        </p>
      </LegalSection>

      <LegalSection id="changes" number={6} title="Changes to these terms">
        <p>
          We may update these Terms from time to time. Continued use of the Site after changes are
          posted means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={7} title="Contact">
        <p>
          Questions about these Terms? Email us at{" "}
          <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
            hello@baynestudio.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}