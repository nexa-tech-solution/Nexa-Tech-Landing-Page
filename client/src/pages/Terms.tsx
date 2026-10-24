import {
  EmailLink,
  LegalPage,
  legalLinkClass,
  type LegalSection,
} from "@/components/nexa/legal-page";

const sections: LegalSection[] = [
  {
    title: "Acceptance",
    body: (
      <p>
        By using nexateam.dev (the "site") you agree to these terms. If you do not agree, please
        do not use the site. Each Nexa Tech app has its own terms of use, which apply to that
        app.
      </p>
    ),
  },
  {
    title: "Use of the site",
    body: (
      <ul>
        <li>Use the site only for lawful purposes.</li>
        <li>Do not try to break, overload or gain unauthorised access to the site or its systems.</li>
        <li>Do not send spam or abusive content through the contact form.</li>
      </ul>
    ),
  },
  {
    title: "Internal dashboard",
    body: (
      <p>
        The dashboard at /dashboard is for Nexa Tech team members only. Accounts are issued by
        us, and you are responsible for keeping your credentials safe. Data it reads from
        connected services, including Google APIs, is handled as described in our{" "}
        <a className={legalLinkClass} href="/privacy">
          Privacy Policy
        </a>
        .
      </p>
    ),
  },
  {
    title: "Intellectual property",
    body: (
      <p>
        The site's content, design, logos and case studies belong to Nexa Tech or its clients
        and may not be copied or reused without permission. Third-party names and logos belong
        to their owners. Open-source projects we publish are licensed under their own licences.
      </p>
    ),
  },
  {
    title: "Projects and quotes",
    body: (
      <p>
        Information on the site, including prices and timelines, is a general guide and not a
        binding offer. Any client work is governed by a separate written agreement.
      </p>
    ),
  },
  {
    title: "Third-party links",
    body: (
      <p>
        The site links to other websites and app stores. We are not responsible for their
        content or practices.
      </p>
    ),
  },
  {
    title: "Disclaimer and liability",
    body: (
      <p>
        The site is provided "as is" without warranties of any kind. To the extent the law
        allows, Nexa Tech is not liable for any indirect or consequential loss arising from your
        use of the site.
      </p>
    ),
  },
  {
    title: "Changes",
    body: (
      <p>
        We may update these terms from time to time. The date at the top shows when they last
        changed, and continued use of the site means you accept the updated terms.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        Questions about these terms? Email <EmailLink />.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The terms that apply when you use nexateam.dev and the Nexa Tech dashboard."
      path="/terms"
      intro={<p>The short version: use the site fairly, and talk to us if anything is unclear.</p>}
      sections={sections}
    />
  );
}
