import React from 'react';
import { Metadata } from 'next';
import { getSiteLastUpdated, formatLastUpdated } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About - RelocationLogic',
  description:
    'About RelocationLogic — mission, data sources, and methodology behind salary and cost-of-living insights.',
};

export default function AboutPage() {
  const lastUpdated = formatLastUpdated(getSiteLastUpdated());
  return (
    <div className="container">
      <main style={{ padding: '2rem 0' }}>
        <h1>About RelocationLogic</h1>
        <p style={{ maxWidth: 820, color: 'var(--muted-foreground)' }}>
          RelocationLogic helps people make better career and relocation decisions
          by combining authoritative public data sources with practical, easy-to-understand
          salary and cost-of-living analysis. We provide city-level and occupation-level
          salary estimates, tax breakdowns, and purchasing power adjustments so job
          seekers and employers can compare locations objectively.
        </p>

        <h2>Our Mission</h2>
        <p style={{ maxWidth: 820, color: 'var(--muted-foreground)' }}>
          Our mission is to increase transparency in career mobility decisions by
          delivering clear, data-driven insights. We prioritize accuracy, reproducibility,
          and accessibility — presenting complex datasets in a usable format for
          individuals and organizations evaluating relocation or hiring choices.
        </p>

        <h2>Data Sources & Methodology</h2>
        <p style={{ maxWidth: 820, color: 'var(--muted-foreground)' }}>
          The platform aggregates and processes public datasets and authoritative
          statistics, including:
        </p>
        <ul style={{ color: 'var(--muted-foreground)', maxWidth: 820 }}>
          <li>
            U.S. Census Bureau — American Community Survey (ACS): demographic and
            cost-of-living indicators used to estimate city-level adjustments.
          </li>
          <li>
            U.S. Bureau of Labor Statistics — Occupational Employment and Wage
            Statistics (OEWS): occupational employment counts and median salary
            estimates for career-level baselines.
          </li>
          <li>
            Other public sources and published indices for rent and housing metrics;
            where appropriate we normalize and document mapping and transformation
            steps in the repository's `scripts` and `data/mappings` folders.
          </li>
        </ul>

        <h2>Keeping Data Fresh</h2>
        <p style={{ maxWidth: 820, color: 'var(--muted-foreground)' }}>
          Data is updated monthly. The most recent dataset refresh is:
          {lastUpdated ? ` ${lastUpdated}` : ' not available'}.
        </p>
      </main>
    </div>
  );
}
