import { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticMetadata(
  '/methodology',
  'Methodology',
  'Methodology: sources, update frequency, modeling assumptions and limitations for RelocationLogic data.'
);

export default function MethodologyPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Methodology</h1>
        <p className="lead">How our data is collected, processed, and presented.</p>
      </header>

      <div className="page-body">
        <section>
          <h2>Data sources</h2>
          <p>
            We use publicly available government statistics, commercial salary surveys, and reputable third-party datasets. Key sources include the U.S. Bureau of Labor Statistics, Census population data, housing price indexes, and curated career datasets. Each page links back to source metadata where applicable.
          </p>
        </section>

        <section>
          <h2>Update frequency</h2>
          <p>
            Core salary and cost-of-living inputs are refreshed monthly, and critical corrections are applied as reported.
          </p>
        </section>

        <section>
          <h2>Modeling assumptions</h2>
          <ul>
            <li>Median salary values are adjusted by a cost-of-living index to estimate local purchasing power.</li>
            <li>We assume standard full-time employment and exclude irregular contract premiums.</li>
            <li>Where local data is sparse, regional proxies are used and annotated in the page metadata.</li>
          </ul>
        </section>

        <section>
          <h2>Limitations</h2>
          <p>
            Estimates are simplifications and cannot capture every individual circumstance. They do not include employer-specific pay bands, stock options, sign-on bonuses, or localized incentives. Users should combine our data with employer-provided information and recruiter advice.
          </p>
        </section>

        <section>
          <h2>Transparency language</h2>
          <p>
            We strive to be transparent about sources, date-stamps, and known gaps. Each city-career page contains a "last updated" stamp and the methodology link for reference.
          </p>
        </section>

        <section>
          <h2>Planning-tool disclaimer</h2>
          <p>
            Our calculators and comparisons are planning tools for budgeting and decision-making. They are not financial or legal advice. For significant relocation decisions, consult tax professionals, HR representatives, and trusted advisors.
          </p>
        </section>

        <section>
          <h2>Questions or corrections</h2>
          <p>
            If you have source suggestions or corrections, please use our <Link href="/contact">contact page</Link> to report them.
          </p>
        </section>
      </div>
    </div>
  );
}
