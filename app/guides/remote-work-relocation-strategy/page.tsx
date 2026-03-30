import { Metadata } from 'next';
import Link from 'next/link';
import EditorialAttribution from '@/components/EditorialAttribution';
import GuideStructuredData from '@/components/GuideStructuredData';
import { generateStaticMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticMetadata(
  '/guides/remote-work-relocation-strategy',
  'Remote work relocation strategy',
  'How remote workers should think about relocation, taxes, and employer policies.'
);

export default function RemoteWorkGuide() {
  return (
    <>
      <GuideStructuredData
        headline="Remote work relocation strategy"
        description="How remote workers should think about relocation, taxes, and employer policies."
        path="/guides/remote-work-relocation-strategy"
        dateModified="2026-02-24"
      />
      <div className="container">
        <header className="page-header">
          <h1>Remote work relocation strategy</h1>
          <p className="lead">Deciding if and when remote workers should relocate.</p>
        </header>

        <div className="page-body">
          <section>
            <h2>Employer policy and tax residency</h2>
            <p>Confirm your employer’s remote policy and whether moving affects payroll, taxes, and benefits. Use our <Link href="/methodology">methodology</Link> and <Link href="/privacy-policy">privacy</Link> pages to understand related considerations.</p>
          </section>

          <section>
            <h2>Quality-of-life vs. career proximity</h2>
            <p>Weigh lifestyle improvements against being near hiring markets and mentorship opportunities. See city indicators on our <Link href="/cities">city pages</Link>.</p>
          </section>

          <EditorialAttribution reviewedDate="February 24, 2026" />
        </div>
      </div>
    </>
  );
}
