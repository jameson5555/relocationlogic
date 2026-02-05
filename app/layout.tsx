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
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2024 RelocationLogic. All rights reserved.</p>
            <p>Make informed career and relocation decisions with data-driven insights.</p>
            {lastUpdated && (
              <p className="data-updated">Data last updated: {lastUpdated}</p>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}
