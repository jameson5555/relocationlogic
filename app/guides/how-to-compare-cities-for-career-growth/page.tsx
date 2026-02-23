import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to compare cities for career growth — RelocationLogic',
  description: 'A practical approach to compare cities based on opportunity, growth, and fit for your career.',
};

export default function CompareCitiesGuide() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>How to compare cities for career growth</h1>
        <p className="lead">A framework for prioritizing cities that support your long-term career goals.</p>
      </header>

      <section>
        <h2>Identify opportunity indicators</h2>
        <p>Look for local industry presence, job postings, and growth rates. Our <Link href="/careers">career pages</Link> and <Link href="/cities">city pages</Link> provide useful starting points.</p>
      </section>

      <section>
        <h2>Compare affordability and mobility</h2>
        <p>Balance salary with housing and transport costs. Use salary and cost-of-living figures together to estimate real mobility.</p>
      </section>

      <section>
        <h2>Network and mentorship</h2>
        <p>Consider where mentors, conferences, and industry meetups occur — geographic proximity can accelerate promotions and learning.</p>
      </section>
    </div>
  );
}
