import Link from 'next/link';
import { getCities, getCareers, formatCurrency } from '@/lib/data';

export default function CitiesPage() {
  const cities = getCities();
  const careers = getCareers();

  return (
    <div className="container">
      <header className="page-header">
        <h1>All Cities</h1>
        <p>Explore city-level data, cost of living, and sample career salaries.</p>
      </header>

      <section className="cities-list">
        {cities.map((city) => (
          <article key={city.id} className="city-card">
            <h2>{city.name}, {city.stateCode}</h2>
            <p>COL Index: {city.costOfLivingIndex} • Avg Rent: {formatCurrency(city.averageRent)}</p>
            <div className="city-links">
              {careers.slice(0, 3).map((career) => (
                <Link key={career.id} href={`/salary/${city.id}/${career.id}`} className="career-link">
                  {career.title}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
