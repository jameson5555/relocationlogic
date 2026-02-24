import { Metadata } from 'next';
import Link from 'next/link';
import EditorialAttribution from '@/components/EditorialAttribution';
import GuideStructuredData from '@/components/GuideStructuredData';

export const metadata: Metadata = {
  title: 'How to evaluate a relocation offer — RelocationLogic',
  description: 'A step-by-step checklist to evaluate relocation offers, compensation, and long-term financial impact.',
};

export default function GuideEvaluateOffer() {
  return (
    <>
      <GuideStructuredData
        headline="How to evaluate a relocation offer"
        description="A step-by-step checklist to evaluate relocation offers, compensation, and long-term financial impact."
        path="/guides/how-to-evaluate-a-relocation-offer"
        dateModified="2026-02-24"
      />
      <div className="container">
        <header className="page-header">
          <h1>How to evaluate a relocation offer</h1>
          <p className="lead">A practical checklist to compare offers and understand long-term impact.</p>
        </header>

        <div className="page-body">
          <section>
            <h2>1. Start with total compensation</h2>
            <p>Compare base salary, bonuses, equity, and benefits. Use our <Link href="/careers">career pages</Link> to benchmark national medians before adjusting for local cost-of-living.</p>
          </section>

          <section>
            <h2>2. Translate salary to purchasing power</h2>
            <p>Use the city pages under <Link href="/cities">Cities</Link> to check housing, taxes, and typical living costs. Ask: will the offer maintain, improve, or reduce your standard of living?</p>
          </section>

          <section>
            <h2>3. Account for one-time and recurring moving costs</h2>
            <p>Include moving services, deposits, travel, and temporary housing. See our guide on <Link href="/guides/hidden-costs-of-moving-cities">hidden moving costs</Link>.</p>
          </section>

          <section>
            <h2>4. Consider career trajectory</h2>
            <p>Evaluate the job’s scope, promotion cadence, and local market growth. Use our <Link href="/guides/how-to-compare-cities-for-career-growth">city comparison guide</Link> to prioritize long-term opportunities.</p>
          </section>

          <section>
            <h2>5. Negotiate with data</h2>
            <p>Present researched salary ranges, relocation support, and target start dates. Cite credible sources or our <Link href="/methodology">methodology</Link> when appropriate.</p>
          </section>

          <EditorialAttribution reviewedDate="February 24, 2026" />
        </div>
      </div>
    </>
  );
}
