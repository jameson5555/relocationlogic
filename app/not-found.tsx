import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <main className="page-main">
        <div className="not-found page-body">
          <h1>Page not found</h1>
          <p>
            The page you requested is unavailable or may have moved.
          </p>
          <ul>
            <li><Link href="/">Go to home</Link></li>
            <li><Link href="/guides">Browse guides</Link></li>
            <li><Link href="/cities">Explore cities</Link></li>
            <li><Link href="/careers">Explore careers</Link></li>
          </ul>
        </div>
      </main>
    </div>
  );
}