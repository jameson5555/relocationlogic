interface GuideStructuredDataProps {
  headline: string;
  description: string;
  path: string;
  dateModified: string;
}

export default function GuideStructuredData({
  headline,
  description,
  path,
  dateModified,
}: GuideStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://relocationlogic.com';
  const canonicalUrl = `${baseUrl}${path}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: canonicalUrl,
    datePublished: dateModified,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'RelocationLogic Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RelocationLogic',
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}