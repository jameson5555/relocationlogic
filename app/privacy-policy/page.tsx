import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — RelocationLogic',
  description: 'Privacy policy describing data collection, use, and cookies for RelocationLogic.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Privacy Policy</h1>
        <p className="lead">This privacy policy explains what data we collect and how we use it.</p>
      </header>

      <section>
        <h2>Information we collect</h2>
        <p>We collect minimal analytics (page views, performance timing) and cookies for session and ad personalization. We do not sell personal data.</p>
      </section>

      <section>
        <h2>How we use data</h2>
        <p>Collected data is used to improve site performance, understand usage patterns, and serve relevant ads via our monetization partners. Contact <a href="mailto:info@relocationlogic.com">info@relocationlogic.com</a> for specific requests.</p>
      </section>

      <section>
        <h2>Third-party services</h2>
        <p>We use Google Analytics and Google AdSense. Their use of data is governed by their separate policies. We link to Google’s privacy pages from our footer when appropriate.</p>
      </section>

      <section>
        <h2>Opt-out</h2>
        <p>Users may opt out of personalized advertising through their browser settings or via ad vendor opt-out pages. We respect Do Not Track signals when technically feasible.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about privacy: <a href="mailto:info@relocationlogic.com">info@relocationlogic.com</a>.</p>
      </section>
    </div>
  );
}
