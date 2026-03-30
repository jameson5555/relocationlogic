import { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticMetadata(
  '/terms',
  'Terms of Use',
  'Terms of use for RelocationLogic covering acceptable use and disclaimers.'
);

export default function TermsPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Terms of Use</h1>
        <p className="lead">Please read these terms before using RelocationLogic.</p>
      </header>

      <div className="page-body">
        <section>
          <h2>Acceptance</h2>
          <p>By using this site you accept these terms. If you disagree, please do not use the site.</p>
        </section>

        <section>
          <h2>Use of content</h2>
          <p>Content is provided for informational purposes and may not be reproduced without attribution. Do not use the site for unlawful activities.</p>
        </section>

        <section>
          <h2>Disclaimer</h2>
          <p>We provide estimates and guidance but cannot guarantee results or job offers. Always verify compensation and benefits with prospective employers.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about these terms: <a href="mailto:info@relocationlogic.com">info@relocationlogic.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
