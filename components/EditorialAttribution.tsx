import Link from 'next/link';

interface EditorialAttributionProps {
  reviewedDate: string;
}

export default function EditorialAttribution({ reviewedDate }: EditorialAttributionProps) {
  return (
    <section className="editorial-attribution" aria-label="Editorial attribution">
      <h2>Editorial Note</h2>
      <p>
        Written and reviewed by <strong>RelocationLogic Editorial Team</strong>.
      </p>
      <p>
        Last reviewed: <strong>{reviewedDate}</strong>.
      </p>
      <p>
        Source and modeling details are documented in our{' '}
        <Link href="/methodology">Methodology</Link> and reflected in dataset timestamps shown across the site.
      </p>
    </section>
  );
}