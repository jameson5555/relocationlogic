import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';
import ConsentScriptLoader from '@/components/ConsentScriptLoader';
import { generateHomeMetadata, siteConfig } from "@/lib/metadata";
import { formatLastUpdated, getSiteLastUpdated } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  ...generateHomeMetadata(),
  metadataBase: new URL(siteConfig.url),
};

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
          <div className="container footer-grid">
            <div className="footer-col footer-platform">
              <h3>RelocationLogic</h3>
              <p className="footer-mission">RelocationLogic helps professionals make clear, data-informed relocation decisions.</p>
            </div>

            <div className="footer-col footer-editorial">
              <h4>Editorial</h4>
              <ul>
                <li><Link href="/guides">Guides</Link></li>
                <li><Link href="/guides/how-to-evaluate-a-relocation-offer">Evaluate an offer</Link></li>
                <li><Link href="/guides/how-to-compare-cities-for-career-growth">Compare cities</Link></li>
              </ul>
            </div>

            <div className="footer-col footer-data">
              <h4>Data</h4>
              <ul>
                <li><Link href="/cities">Cities</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/methodology">Methodology</Link></li>
              </ul>
            </div>

            <div className="footer-col footer-trust">
              <h4>Trust & Legal</h4>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/privacy-policy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-bottom" aria-hidden>
              <div>
                {lastUpdated && (
                  <p className="data-updated">Data last updated: {lastUpdated}</p>
                )}
                <p>© 2026 RelocationLogic. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
          <ConsentScriptLoader />
          <CookieConsent />
      </body>
    </html>
  );
}
