import type { Metadata } from "next";
import "./globals.css";
import { generateHomeMetadata } from "@/lib/metadata";

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
              <a href="/" className="logo">
                <h1>RelocationLogic</h1>
              </a>
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/cities">Cities</a></li>
                <li><a href="/careers">Careers</a></li>
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
