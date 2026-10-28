import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "barzi Privacy Policy — Bayne Studio",
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
      eyebrow="barzi"
      title="Privacy Policy"
      lastUpdated="October 28, 2026"
      sections={sections}
    >
      <p className="text-base text-foreground/80 leading-relaxed mb-14 max-w-[560px]">
        barzi is an app made by Bayne Studio ("we", "us"). It shows what's happening at bars
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
            <strong>Your activity in barzi.</strong> The bars you save, your check-ins (which bar, and
            when), and how you use the app: when you open it, which bars you look at, what you search
            for, and when you tap directions, call, website or Instagram.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            <strong>Your suggestions.</strong> Edits you suggest for a bar, or a bar you tell us is missing.
          </li>
          <li className="relative before:absolute before:-left-5 before:content-['—'] before:text-muted-foreground">
            <strong>Your location.</strong> barzi uses your location while the app is open to show what's near you and to confirm you're at a bar when you check in. We don't store your exact location. We keep a rough area (about a few kilometers) for a few days to stop misuse.
          </li>
        </ul>

        <p className="mt-4">
          We keep this usage record ourselves to see which features and bars people use. We don't use
          third-party advertising or analytics tools, we don't track you across other apps or
          websites, and we don't sell your information.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use-it" number={2} title="How we use it">
        <p>
          We use this information to run barzi: to sign you in, show your profile, saved bars and
          check-in history, and keep check-ins to one per bar per night. We look at usage in total
          (for example, how many people viewed a bar this month) to improve the app and, later, to
          show bars how many people found them. We never show a bar who you are.
        </p>
      </LegalSection>

      <LegalSection id="who-we-share-it-with" number={3} title="Who we share it with">
        <p>
          <strong>Supabase</strong> stores barzi's data and runs our servers.
        </p>
        <p>
          <strong>Apple</strong> handles Sign in with Apple.
        </p>
        <p>We share information with anyone else only if the law requires it.</p>
      </LegalSection>

      <LegalSection id="data-retention" number={4} title="How long we keep it">
        <p>
          We keep your information while you have an account. When you delete your account, we delete
          your profile, photo, saved bars, check-ins, suggestions and usage record.
        </p>
      </LegalSection>

      <LegalSection id="your-choices" number={5} title="Your choices">
        <p>
          <strong>Delete your account</strong> in barzi under Profile, Settings, Delete account.
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
        <p>barzi is only for people 21 or older. We don't knowingly collect information from anyone younger.</p>
      </LegalSection>

      <LegalSection id="changes" number={7} title="Changes">
        <p>If we change this policy, we'll update the date at the top. If a change is significant, we'll let you know in the app.</p>
      </LegalSection>

      <LegalSection id="contact" number={8} title="Contact">
        <p>
          Bayne Studio, <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">hello@baynestudio.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
