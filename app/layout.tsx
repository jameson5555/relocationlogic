import type { Metadata } from "next";
import "./globals.css";
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
        {/* Google tag (gtag.js) - site-wide */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TDVLTM3QGR"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-TDVLTM3QGR');` }} />
        {/* Google AdSense loader (site-wide) */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6539140496743179" crossOrigin="anonymous"></script>
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
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/methodology">Methodology</Link></li>
                <li><Link href="/privacy-policy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/guides">Guides</Link></li>
              </ul>
            </nav>
            {lastUpdated && (
              <p className="data-updated">Data last updated: {lastUpdated}</p>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}
