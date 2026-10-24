import {
  EmailLink,
  LegalPage,
  legalLinkClass,
  type LegalSection,
} from "@/components/nexa/legal-page";

const sections: LegalSection[] = [
  {
    title: "Who we are",
    body: (
      <p>
        Nexa Tech ("we", "us") is a small product studio building web tools, mobile apps and
        browser extensions. This policy covers the website nexateam.dev and the internal
        dashboard we run on it. Each of our apps has its own privacy policy, linked from its
        product page, which applies to that app.
      </p>
    ),
  },
  {
    title: "Information we collect",
    body: (
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address, message and the page you sent
          it from. We use this only to reply to you.
        </li>
        <li>
          <strong>Emails:</strong> if you write to us directly, we keep the conversation so we
          can follow up.
        </li>
        <li>
          <strong>Usage analytics:</strong> we use Vercel Web Analytics, which counts page views
          in aggregate without cookies and without identifying individual visitors.
        </li>
      </ul>
    ),
  },
  {
    title: "Google user data",
    body: (
      <>
        <p>
          Our internal dashboard can connect to Google services (such as AdMob, Google Play and
          Firebase / Google Analytics) to show revenue and usage reports for apps that Nexa Tech
          owns. Only Nexa Tech team members sign in to it.
        </p>
        <ul>
          <li>
            <strong>Access requested:</strong> read-only access, for example the AdMob scope{" "}
            <code>admob.readonly</code>, to read account details, app lists and earnings
            reports.
          </li>
          <li>
            <strong>How it is used:</strong> solely to display those reports inside our own
            dashboard. We do not use it for advertising, do not sell it and do not share it with
            third parties.
          </li>
          <li>
            <strong>Storage:</strong> OAuth tokens are encrypted at rest on our servers; report
            figures are stored so we can chart them over time.
          </li>
          <li>
            <strong>Revoking access:</strong> remove the app at{" "}
            <a
              className={legalLinkClass}
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
            >
              myaccount.google.com/permissions
            </a>{" "}
            at any time, or ask us to delete the connection.
          </li>
        </ul>
        <p>
          Nexa Tech's use and transfer of information received from Google APIs adheres to the{" "}
          <a
            className={legalLinkClass}
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </>
    ),
  },
  {
    title: "How we share information",
    body: (
      <p>
        We do not sell personal information. We only share it with service providers that host
        and run this site (such as Vercel for hosting and our email provider for replies), and
        only as needed to provide the service, or when the law requires it.
      </p>
    ),
  },
  {
    title: "Retention and security",
    body: (
      <p>
        We keep contact messages for as long as needed to handle your request and then archive
        or delete them. Access to stored data is limited to the Nexa Tech team, and secrets are
        encrypted. No system is perfectly secure, but we take reasonable measures to protect
        your information.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <p>
        You can ask us to access, correct or delete the information we hold about you by
        emailing <EmailLink />. We will respond as soon as we can.
      </p>
    ),
  },
  {
    title: "Children",
    body: (
      <p>
        This website is not directed to children under 13, and we do not knowingly collect their
        personal information.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The date at the top shows when it last
        changed.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        Questions about this policy? Email <EmailLink />.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How Nexa Tech collects, uses and protects information on nexateam.dev, including Google user data used by our internal dashboard."
      path="/privacy"
      intro={<p>We collect as little as possible, and we explain here exactly what and why.</p>}
      sections={sections}
    />
  );
}
