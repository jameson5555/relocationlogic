import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hidden costs of moving cities — RelocationLogic',
  description: 'Unexpected expenses to plan for when moving cities, from deposits to increased commute costs.',
};

export default function HiddenCostsGuide() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Hidden costs of moving cities</h1>
        <p className="lead">Common overlooked expenses that change the real cost of a move.</p>
      </header>

      <section>
        <h2>Upfront housing costs</h2>
        <p>Security deposits, broker fees, first and last month rent, and application costs can add several thousand dollars. Check average rents on our <Link href="/cities">city pages</Link> to estimate this.</p>
      </section>

      <section>
        <h2>Transportation and commuting</h2>
        <p>Higher parking, tolls, or transit passes can change monthly budgets. Include commute time when valuing remote versus in-office roles.</p>
      </section>

      <section>
        <h2>One-time setup costs</h2>
        <p>Furniture, utility deposits, and home setup (internet installation, repairs) are frequently underestimated.</p>
      </section>

      <section>
        <h2>Taxes and benefits differences</h2>
        <p>State income taxes, local taxes, and employer benefits vary. Use our methodology page to understand tax inputs and see city tax notes on each <Link href="/cities">city page</Link>.</p>
      </section>
    </div>
  );
}
