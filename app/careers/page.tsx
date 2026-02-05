import Link from 'next/link';
import { getCareers, getCities, formatCurrency } from '@/lib/data';

export default function CareersPage() {
  const careers = getCareers();
  const cities = getCities();

  return (
    <div className="container">
      <header className="page-header">
        <h1>All Careers</h1>
        <p>Browse careers and view sample salaries in popular cities.</p>
      </header>

      <section className="careers-list">
        {careers.map((career) => (
          <article key={career.id} className="career-card">
            <h2>{career.title}</h2>
            <p className="career-category">{career.category}</p>
            <p>{career.description}</p>
            <div className="career-links">
              {cities.slice(0, 3).map((city) => (
                <Link key={city.id} href={`/salary/${city.id}/${career.id}`} className="salary-link">
                  {city.name}, {city.stateCode}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
