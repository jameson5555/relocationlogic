import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guides — RelocationLogic',
  description: 'Practical guides for evaluating relocation offers, hidden moving costs, remote-work strategies, and city comparisons.',
};

export default function GuidesIndex() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Guides</h1>
        <p className="lead">Practical, human-centered guidance for relocation and career decisions.</p>
      </header>

      <div className="page-body">
        <ul>
          <li><Link href="/guides/how-to-evaluate-a-relocation-offer">How to evaluate a relocation offer</Link></li>
          <li><Link href="/guides/hidden-costs-of-moving-cities">Hidden costs of moving cities</Link></li>
          <li><Link href="/guides/cost-of-living-mistakes">Cost-of-living mistakes</Link></li>
          <li><Link href="/guides/remote-work-relocation-strategy">Remote work relocation strategy</Link></li>
          <li><Link href="/guides/how-to-compare-cities-for-career-growth">How to compare cities for career growth</Link></li>
        </ul>

        <p>Explore our <Link href="/cities">city pages</Link> and <Link href="/careers">career pages</Link> to see the data behind these guides.</p>
      </div>
    </div>
  );
}
