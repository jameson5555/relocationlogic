import { Metadata } from 'next';
import Link from 'next/link';
import EditorialAttribution from '@/components/EditorialAttribution';

export const metadata: Metadata = {
  title: 'Cost-of-living mistakes — RelocationLogic',
  description: 'Common mistakes people make when using cost-of-living data and how to avoid them.',
};

export default function ColMistakesGuide() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Cost-of-living mistakes</h1>
        <p className="lead">How to avoid common pitfalls when comparing locations.</p>
      </header>

      <div className="page-body">
        <section>
          <h2>Mistake: Comparing headline salaries without context</h2>
          <p>Headline numbers can be misleading. Always compare purchasing power using local housing, taxes, and living costs available on our <Link href="/cities">city pages</Link>.</p>
        </section>

        <section>
          <h2>Mistake: Ignoring benefits and taxes</h2>
          <p>Health insurance premiums, employer retirement matches, and tax differentials are material — include them when evaluating offers.</p>
        </section>

        <section>
          <h2>Mistake: Assuming averages fit everyone</h2>
          <p>Averages hide distribution and variability. Consider your role’s seniority, local demand, and whether you’ll be paid near the median.</p>
        </section>

        <EditorialAttribution reviewedDate="February 24, 2026" />
      </div>
    </div>
  );
}
