import { Metadata } from 'next';
import { City, Career } from '@/types';
import { formatCurrency, getPageLastUpdated } from './data';

export const siteConfig = {
  name: 'RelocationLogic',
  description: 'Make informed career and relocation decisions with comprehensive salary data, tax calculations, and cost of living analysis.',
  // Read canonical site URL from environment so deployments can change host without code rebuild
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://relocationlogic.com',
  ogImage: (process.env.NEXT_PUBLIC_SITE_URL || 'https://relocationlogic.com') + '/og-image.png',
};

/**
 * Generate metadata for homepage
 */
export function generateHomeMetadata(): Metadata {
  const lastUpdated = getPageLastUpdated('home');
  return {
    title: 'RelocationLogic - Career & Relocation Salary Calculator',
    description: siteConfig.description,
    keywords: [
      'salary calculator',
      'cost of living calculator',
      'relocation advice',
      'career planning',
      'tax calculator',
      'city comparison',
    ],
    openGraph: {
      title: 'RelocationLogic - Career & Relocation Salary Calculator',
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
      modifiedTime: lastUpdated || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'RelocationLogic - Career & Relocation Salary Calculator',
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: lastUpdated ? { 'data-last-updated': lastUpdated } : undefined,
  };
}

/**
 * Generate metadata for city-career-salary page
 */
export function generatePageMetadata(
  city: City,
  career: Career,
  salary: number,
  lastUpdated?: string
): Metadata {
  const title = `${career.title} Salary in ${city.name}, ${city.stateCode} - ${formatCurrency(salary)}`;
  const description = `Explore ${career.title} salaries in ${city.name}, ${city.state}. Get detailed tax calculations, cost of living analysis, and relocation insights. Average salary: ${formatCurrency(salary)}.`;

  return {
    title,
    description,
    keywords: [
      `${career.title} salary`,
      `${city.name} ${career.title}`,
      `${career.title} ${city.state}`,
      `cost of living ${city.name}`,
      `${city.name} taxes`,
      career.category.toLowerCase(),
    ],
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/salary/${city.id}/${career.id}`,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'article',
      modifiedTime: lastUpdated || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/salary/${city.id}/${career.id}`,
    },
    other: lastUpdated ? { 'data-last-updated': lastUpdated } : undefined,
  };
}

/**
 * Generate structured data (JSON-LD) for SEO
 */
export function generateStructuredData(
  city: City,
  career: Career,
  salary: number,
  lastUpdated?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    dateModified: lastUpdated,
    headline: `${career.title} Salary in ${city.name}, ${city.stateCode}`,
    description: `Comprehensive salary information for ${career.title} positions in ${city.name}, including tax calculations and cost of living analysis.`,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/salary/${city.id}/${career.id}`,
    },
    about: {
      '@type': 'Occupation',
      name: career.title,
      occupationLocation: {
        '@type': 'City',
        name: city.name,
        address: {
          '@type': 'PostalAddress',
          addressRegion: city.stateCode,
        },
      },
      estimatedSalary: [
        {
          '@type': 'MonetaryAmountDistribution',
          name: 'base',
          currency: 'USD',
          median: salary,
        },
      ],
    },
  };
}
