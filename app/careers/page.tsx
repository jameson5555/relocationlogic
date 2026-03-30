import { Metadata } from 'next';
import { getCareers, getCities, formatCurrency } from '@/lib/data';
import { generateStaticMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticMetadata(
  '/careers',
  'Careers',
  'Browse careers and see salary information across multiple cities and industries.'
);

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
                <a key={city.id} href={`/salary/${city.id}/${career.id}/`} className="salary-link">
                  {city.name}, {city.stateCode}
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
