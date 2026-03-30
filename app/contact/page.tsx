import { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticMetadata(
  '/contact',
  'Contact',
  'Contact RelocationLogic for corrections, data inquiries, and partnerships.'
);

export default function ContactPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Contact</h1>
        <p className="lead">We welcome feedback, data corrections, and partnership inquiries.</p>
      </header>

      <div className="page-body">
        <section>
          <h2>Report a data issue</h2>
          <p>
            If you find an error or omission on a city or career page, please include the page URL and a short description. We aim to respond within 3 business days. Email: <a href="mailto:info@relocationlogic.com">info@relocationlogic.com</a>
          </p>
        </section>

        <section>
          <h2>Partnerships</h2>
          <p>
            For data partnerships, licensing, or media inquiries, please reach out to the same address and include organization details and use case.
          </p>
        </section>

        <section>
          <h2>Privacy and terms</h2>
          <p>
            See our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms">Terms of Use</Link> for details about data handling and site usage.
          </p>
        </section>
      </div>
    </div>
  );
}
