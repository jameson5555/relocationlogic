import type { Metadata } from "next";
import "./globals.css";
import { generateHomeMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata: Metadata = generateHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <nav className="main-nav">
              <Link href="/" className="logo">
                <h1>RelocationLogic</h1>
              </Link>
              <ul className="nav-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/cities">Cities</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2024 RelocationLogic. All rights reserved.</p>
            <p>Make informed career and relocation decisions with data-driven insights.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
