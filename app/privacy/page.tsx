import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Privacy Policy — Bayne Studio",
  robots: { index: true, follow: true },
}

const sections = [
  { id: "information-we-collect", title: "Information we collect" },
  { id: "how-we-use-it", title: "How we use your information" },
  { id: "third-party-services", title: "Third-party services" },
  { id: "data-retention", title: "Data retention" },
  { id: "your-choices", title: "Your choices" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact" },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="August 2026"
      sections={sections}
    >
      <p className="text-base text-foreground/80 leading-relaxed mb-14 max-w-[560px]">
        This Privacy Policy explains how Matthew Bayne LLC, doing business as Bayne Studio
        (&quot;Bayne Studio,&quot; &quot;we,&quot; &quot;us&quot;), handles information collected
        through baynestudio.com (the &quot;Site&quot;).
      </p>

      <LegalSection id="information-we-collect" number={1} title="Information we collect">
        <p>
          When you submit our contact form, we collect the information you provide: your name,
          email address, project type, budget range, and message. We use this only to respond to
          your inquiry and discuss your project — we don&apos;t use it for anything else, and we
          don&apos;t sell it.
        </p>
        <p>
          We also use Vercel Analytics to understand overall site traffic (e.g. page views). It is
          configured to operate without tracking cookies or collecting personally identifiable
          information about individual visitors.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use-it" number={2} title="How we use your information">
        <p>
          Contact form submissions are used solely to respond to your inquiry, discuss a potential
          project, and — if we move forward together — deliver that work. We do not use your
          information for marketing you didn&apos;t ask for, and we do not share it with third
          parties except as described below.
        </p>
      </LegalSection>

      <LegalSection id="third-party-services" number={3} title="Third-party services">
        <p>
          Contact form submissions are delivered to us using EmailJS, a third-party email service.
          Your submission passes through EmailJS&apos;s systems in order to reach our inbox. You can
          review EmailJS&apos;s own privacy practices on their website.
        </p>
        <p>
          If we build you a preview/demo site, it is hosted on our own infrastructure at a
          baynestudio.com subdomain path during the sales process, and is not indexed by search
          engines.
        </p>
      </LegalSection>

      <LegalSection id="data-retention" number={4} title="Data retention">
        <p>
          We retain contact form submissions for as long as reasonably necessary to respond to your
          inquiry and, if we work together, for the duration of our business relationship plus a
          reasonable period afterward for our records. You can request deletion at any time — see
          Contact below.
        </p>
      </LegalSection>

      <LegalSection id="your-choices" number={5} title="Your choices">
        <p>
          You can ask us to access, correct, or delete any personal information we hold about you by
          emailing us at the address below. We&apos;ll respond promptly.
        </p>
      </LegalSection>

      <LegalSection id="changes" number={6} title="Changes to this policy">
        <p>
          We may update this policy from time to time as our business or applicable law changes.
          We&apos;ll update the date at the top of this page when we do.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={7} title="Contact">
        <p>
          Questions about this policy or your data? Email us at{" "}
          <a href="mailto:hello@matthew-bayne.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
            hello@matthew-bayne.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}