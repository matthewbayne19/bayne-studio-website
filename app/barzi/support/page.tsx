import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "barzi support — Bayne Studio",
  robots: { index: true, follow: true },
}

const sections = [
  { id: "contact", title: "Contact" },
  { id: "getting-started", title: "Getting started" },
  { id: "check-ins", title: "Check-ins" },
  { id: "location", title: "Location" },
  { id: "something-wrong", title: "Something wrong or missing?" },
  { id: "delete-your-account", title: "Delete your account" },
  { id: "copyright", title: "Copyright" },
]

export default function BarziSupportPage() {
  return (
    <LegalPage
      eyebrow="barzi"
      title="barzi support"
      lastUpdated="October 29, 2026"
      sections={sections}
    >
      <p className="text-base text-foreground/80 leading-relaxed mb-14 max-w-[560px]">
        Questions, problems or feedback? Email {" "}
        <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
          hello@baynestudio.com
        </a>{" "}
        and we'll get back to you, usually within a couple of days. For more information, see our {" "}
        <a href="/barzi/privacy" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
          Privacy Policy
        </a>{" "}
        and {" "}
        <a href="/barzi/terms" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
          Terms of Use
        </a>
        .
      </p>

      <LegalSection id="contact" number={1} title="Contact">
        <p>
          Questions, problems or feedback? Email {" "}
          <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
            hello@baynestudio.com
          </a>{" "}
          and we'll get back to you, usually within a couple of days.
        </p>
      </LegalSection>

      <LegalSection id="getting-started" number={2} title="Getting started">
        <ul className="space-y-2.5 pl-5">
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            barzi is for people 21 and older.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            Sign in with Apple. barzi never sees your Apple password.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            barzi is live in Hoboken, NJ. More towns are coming.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="check-ins" number={3} title="Check-ins">
        <ul className="space-y-2.5 pl-5">
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            Tap Check in on a bar's page when you're there. barzi uses your location to confirm you're at the bar.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            You can check in to each bar once per night. The night resets at 5 AM Eastern.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="location" number={4} title="Location">
        <p>
          barzi only uses your location while the app is open, to show what's near you and to check you in. You can change this anytime in iPhone Settings &gt; barzi &gt; Location.
        </p>
      </LegalSection>

      <LegalSection id="something-wrong" number={5} title="Something wrong or missing?">
        <ul className="space-y-2.5 pl-5">
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            Wrong hours, an event that isn't happening, or a missing special: open the bar's page and tap Suggest an edit.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            A bar we don't have yet: Profile &gt; Settings &gt; Suggest an edit &gt; Add a bar. We review every suggestion.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="delete-your-account" number={6} title="Delete your account">
        <p>
          Profile &gt; Settings &gt; Delete account. This permanently deletes your account, check-ins and saved spots. If you can't get into the app, email {" "}
          <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
            hello@baynestudio.com
          </a>{" "}
          from the email on your Apple ID and we'll delete it for you.
        </p>
      </LegalSection>

      <LegalSection id="copyright" number={7} title="Copyright">
        <p>
          If you believe something on barzi infringes your copyright, email {" "}
          <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
            hello@baynestudio.com
          </a>{" "}
          with a link or description and we'll review it and remove it if appropriate.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
