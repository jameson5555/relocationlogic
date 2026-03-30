import { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticMetadata(
  '/privacy-policy',
  'Privacy Policy',
  'Privacy policy describing data collection, use, and cookies for RelocationLogic.'
);

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Privacy Policy</h1>
        <p className="lead">This privacy policy explains what data we collect and how we use it.</p>
      </header>

      <div className="page-body">
        <section>
          <h2>Overview</h2>
          <p>
            RelocationLogic collects limited data to operate the site, analyze usage, and provide personalized experiences where you choose to enable them. We do not sell personal data.
          </p>
        </section>

        <section>
          <h2>Google AdSense disclosure</h2>
          <p>
            We display advertisements provided by Google AdSense. Ad requests may be loaded to serve ads and measure delivery. Personalized advertising is enabled only if you accept cookies via our cookie consent banner.
          </p>
          <p>
            To manage ad personalization from Google, visit <a href="https://adssettings.google.com/">Google Ad Settings</a>.
          </p>
        </section>

        <section>
          <h2>Third‑party advertising and partners</h2>
          <p>
            We work with third‑party advertising partners (including Google and other programmatic partners) who may use cookies and similar technologies to deliver and measure ads. These partners have their own privacy practices and may collect information about your visits to this and other websites to provide interest‑based advertising.
          </p>
          <p>
            A current list of our primary advertising partners is available on request; contact us at <a href="mailto:info@relocationlogic.com">info@relocationlogic.com</a>.
          </p>
        </section>

        <section>
          <h2>Cookie usage</h2>
          <p>
            We use cookies for four primary purposes: (1) essential site functionality (session cookies), (2) user preference persistence (for example theme or language choices), (3) analytics (to understand site usage and performance), and (4) advertising personalization (only if you accept cookies).
          </p>
          <p>
            Our cookie consent banner allows you to accept or dismiss optional cookies. If you dismiss, analytics remains off and ads are served in a non-personalized/contextual mode where available. You can clear cookies from your browser at any time; doing so will reset consent.
          </p>
        </section>

        <section>
          <h2>Analytics</h2>
          <p>
            We use analytics tools to collect aggregated usage data such as page views, session duration, and technical performance metrics. Analytics help us improve the site and the data we provide. Analytics scripts are only activated after you accept cookies via the consent banner.
          </p>
          <p>
            Aggregated analytics data is retained for operational purposes; we do not attempt to identify individual users from analytics data.
          </p>
        </section>

        <section>
          <h2>Personalization opt‑out</h2>
          <p>
            You can opt out of personalized advertising and analytics by dismissing or declining cookies in our cookie banner, by clearing cookies in your browser, or by using vendor opt‑out tools (for example, Google Ad Settings or the <a href="https://optout.aboutads.info/">YourAdChoices</a> page). Disabling personalization does not prevent all ads from being shown; you will receive non‑personalized (contextual) ads instead.
          </p>
        </section>

        <section>
          <h2>External advertising partners clause</h2>
          <p>
            Our advertising partners may place and read their own cookies on your device and may collect information about your interaction with ads. These partners are independent data controllers with respect to that data and their use is governed by their respective privacy policies. We encourage you to review partner privacy notices for full details.
          </p>
        </section>

        <section>
          <h2>Contact &amp; Data Requests</h2>
          <p>
            For questions about this policy, data access, correction, or deletion requests, or to request a list of our advertising partners, contact us at <a href="mailto:info@relocationlogic.com">info@relocationlogic.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
