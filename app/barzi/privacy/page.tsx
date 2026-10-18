import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Barzi Privacy Policy — Bayne Studio",
  robots: { index: true, follow: true },
}

const sections = [
  { id: "information-we-collect", title: "What we collect" },
  { id: "how-we-use-it", title: "How we use it" },
  { id: "who-we-share-it-with", title: "Who we share it with" },
  { id: "data-retention", title: "How long we keep it" },
  { id: "your-choices", title: "Your choices" },
  { id: "age", title: "Age" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" },
]

export default function BarziPrivacyPage() {
  return (
    <LegalPage
      eyebrow="Barzi"
      title="Privacy Policy"
      lastUpdated="October 18, 2026"
      sections={sections}
    >
      <p className="text-base text-foreground/80 leading-relaxed mb-14 max-w-[560px]">
        Barzi is an app made by Bayne Studio ("we", "us"). It shows what's happening at bars
        near you and lets you check in when you're there. This policy explains what we collect,
        why, and what you can do about it.
      </p>

      <LegalSection id="information-we-collect" number={1} title="What we collect">
        <ul className="space-y-2.5 pl-5">
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            <strong>Your Apple sign-in.</strong> When you sign in with Apple, we receive an account ID
            and an email address. If you choose "Hide My Email", the address is a private relay
            address from Apple.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            <strong>Your profile.</strong> The display name and photo you choose, and the date you
            confirmed you are 21 or older.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            <strong>Your activity in Barzi.</strong> The bars you save and your check-ins (which bar,
            and when).
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            <strong>Your location, only when you check in.</strong> Barzi asks for your location to
            confirm you're at the bar and to show what's near you. We use it for that moment only
            and do not store it.
          </li>
        </ul>

        <p className="mt-4">
          We don't use advertising or analytics tools, we don't track you across other apps or
          websites, and we don't sell your information.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use-it" number={2} title="How we use it">
        <p>
          We use this information to run Barzi: to sign you in, show your profile, saved bars and
          check-in history, and keep check-ins to one per bar per night.
        </p>
      </LegalSection>

      <LegalSection id="who-we-share-it-with" number={3} title="Who we share it with">
        <p>
          <strong>Supabase</strong> stores Barzi's data and runs our servers.
        </p>
        <p>
          <strong>Apple</strong> handles Sign in with Apple.
        </p>
        <p>We share information with anyone else only if the law requires it.</p>
      </LegalSection>

      <LegalSection id="data-retention" number={4} title="How long we keep it">
        <p>
          We keep your information while you have an account. When you delete your account, we
          delete your profile, photo, saved bars and check-ins.
        </p>
      </LegalSection>

      <LegalSection id="your-choices" number={5} title="Your choices">
        <p>
          <strong>Delete your account</strong> in Barzi under Profile, Settings, Delete account.
        </p>
        <p>
          <strong>Turn off location</strong> at any time in your iPhone's Settings. You can still
          browse bars, but you can't check in.
        </p>
        <p>
          <strong>Ask us</strong> for a copy of your information, or to correct it, by emailing
          <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"> hello@baynestudio.com</a>.
        </p>
      </LegalSection>

      <LegalSection id="age" number={6} title="Age">
        <p>Barzi is only for people 21 or older. We don't knowingly collect information from anyone younger.</p>
      </LegalSection>

      <LegalSection id="changes" number={7} title="Changes">
        <p>If we change this policy, we'll update the date at the top. If a change is significant, we'll let you know in the app.</p>
      </LegalSection>

      <LegalSection id="contact" number={8} title="Contact">
        <p>
          Bayne Studio, <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">hello@baynestudio.com</a>
        </p>
      </LegalSection>
    </LegalPage>
  )
}
