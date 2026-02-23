import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';
import ConsentScriptLoader from '@/components/ConsentScriptLoader';
import { generateHomeMetadata } from "@/lib/metadata";
import { formatLastUpdated, getSiteLastUpdated } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = generateHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lastUpdated = formatLastUpdated(getSiteLastUpdated());
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <nav className="main-nav">
              <Link href="/" className="logo" aria-label="RelocationLogic home">
                <picture>
                  <source srcSet="/logo-dark.png" media="(prefers-color-scheme: dark)" />
                  <img
                    src="/logo-light.png"
                    alt="RelocationLogic"
                    className="logo-image"
                    width={240}
                    height={52}
                    decoding="async"
                  />
                </picture>
                <span className="sr-only">RelocationLogic</span>
              </Link>
              <ul className="nav-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/cities">Cities</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/guides">Guides</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2024 RelocationLogic. All rights reserved.</p>
            <p className="mission">RelocationLogic helps professionals make clear, data-informed relocation decisions focused on career and cost-of-living tradeoffs.</p>
            <nav className="footer-nav">
              <p className="footer-links">
                <Link href="/about">About</Link> &nbsp;|&nbsp; <Link href="/methodology">Methodology</Link> &nbsp;|&nbsp; <Link href="/privacy-policy">Privacy</Link> &nbsp;|&nbsp; <Link href="/terms">Terms</Link> &nbsp;|&nbsp; <Link href="/contact">Contact</Link> &nbsp;|&nbsp; <Link href="/guides">Guides</Link>
              </p>
            </nav>
            {lastUpdated && (
              <p className="data-updated">Data last updated: {lastUpdated}</p>
            )}
          </div>
        </footer>
          <ConsentScriptLoader />
          <CookieConsent />
      </body>
    </html>
  );
}
