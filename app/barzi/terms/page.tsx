import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "barzi Terms of Use — Bayne Studio",
  robots: { index: true, follow: true },
}

const sections = [
  { id: "who-can-use-barzi", title: "Who can use barzi" },
  { id: "bar-information", title: "Bar information" },
  { id: "drink-responsibly", title: "Drink responsibly" },
  { id: "your-account", title: "Your account" },
  { id: "our-content", title: "Our content" },
  { id: "no-warranty", title: "No warranty" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" },
]

export default function BarziTermsPage() {
  return (
    <LegalPage
      eyebrow="barzi"
      title="Terms of Use"
      lastUpdated="October 20, 2026"
      sections={sections}
    >
      <p className="text-base text-foreground/80 leading-relaxed mb-14 max-w-[560px]">
        These terms apply when you use barzi, an app made by Bayne Studio ("we", "us"). By using
        barzi, you agree to them.
      </p>

      <LegalSection id="who-can-use-barzi" number={1} title="Who can use barzi">
        <p>You must be 21 or older, which is the legal drinking age in the United States.</p>
      </LegalSection>

      <LegalSection id="bar-information" number={2} title="Bar information">
        <p>
          We work to keep hours, events, specials and amenities accurate, but bars change them without
          telling us. Check with the bar before you go. If something is wrong, use Suggest an edit in
          Settings.
        </p>
      </LegalSection>

      <LegalSection id="drink-responsibly" number={3} title="Drink responsibly">
        <p>
          barzi helps you find places to go. It's not a reason to drink more. Never drink and drive.
        </p>
      </LegalSection>

      <LegalSection id="your-account" number={4} title="Your account">
        <p>
          You're responsible for what you add to barzi, including your display name, photo and
          anything you send with Suggest an edit. Keep it appropriate: nothing offensive, nothing
          that impersonates someone, and no misusing check-ins. When you suggest an edit, you let us
          use it to update barzi.
        </p>
        <p>
          We may remove any content, or suspend or delete any account, at any time and for any reason,
          including a breach of these terms, with or without notice. If we delete your account, its
          profile, photo, check-ins and saved bars are deleted with it.
        </p>
        <p>
          Content you upload. You may only upload photos and other content that you own or have
          permission to use. By uploading, you confirm you have those rights. If you believe
          something on barzi infringes your copyright, email hello@baynestudio.com and we will review
          it and remove it if appropriate.
        </p>
        <p>You can delete your account at any time in Settings.</p>
      </LegalSection>

      <LegalSection id="our-content" number={5} title="Our content">
        <p>
          The barzi app, its design and the venue information we've gathered belong to Bayne Studio.
          Bar names and logos belong to their owners.
        </p>
        <p>
          barzi is for personal use. Don’t scrape, crawl, bulk download or copy barzi’s venue
          information, don’t use bots, scripts or other automated means to access barzi, and don’t
          use anything from barzi to build or feed another product or database. We may suspend or
          delete accounts that do.
        </p>
      </LegalSection>

      <LegalSection id="no-warranty" number={6} title="No warranty">
        <p>
          barzi is provided "as is". To the extent the law allows, we aren't liable for losses that
          come from using the app or relying on its information.
        </p>
      </LegalSection>

      <LegalSection id="changes" number={7} title="Changes">
        <p>We may update these terms. If we do, we'll change the date at the top. Continuing to use barzi means you accept the update.</p>
      </LegalSection>

      <LegalSection id="contact" number={8} title="Contact">
        <p>
          Bayne Studio, <a href="mailto:hello@baynestudio.com" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">hello@baynestudio.com</a>, or via the app.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
