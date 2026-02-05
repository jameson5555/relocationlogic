import Link from "next/link";
import { getCities, getCareers, formatCurrency } from "@/lib/data";

export default function Home() {
  const cities = getCities();
  const careers = getCareers();

  return (
    <div className="container home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>Make Smarter Career & Relocation Decisions</h1>
        <p className="hero-subtitle">
          Compare salaries, taxes, and cost of living across cities and careers.
          Get data-driven insights to plan your next move.
        </p>
      </section>

      {/* Popular Searches */}
      <section className="popular-searches">
        <h2>Popular Career & City Combinations</h2>
        <div className="search-grid">
          {cities.slice(0, 5).map((city) =>
            careers.slice(0, 2).map((career) => (
              <Link
                key={`${city.id}-${career.id}`}
                href={`/salary/${city.id}/${career.id}/`}
                className="search-card"
              >
                <h3>{career.title}</h3>
                <p>{city.name}, {city.stateCode}</p>
                <span className="arrow">→</span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Top Cities */}
      <section className="cities-section">
        <h2>Explore Cities</h2>
        <div className="cities-grid">
          {cities.map((city) => (
            <div key={city.id} className="city-card">
              <h3>{city.name}, {city.stateCode}</h3>
              <div className="city-stats">
                <div>
                  <strong>Population:</strong> {city.population.toLocaleString()}
                </div>
                <div>
                  <strong>COL Index:</strong> {city.costOfLivingIndex}
                </div>
                <div>
                  <strong>Median Home:</strong> {formatCurrency(city.medianHomePrice)}
                </div>
              </div>
              <div className="city-careers">
                {careers.slice(0, 3).map((career) => (
                  <Link
                    key={career.id}
                    href={`/salary/${city.id}/${career.id}/`}
                    className="career-link"
                  >
                    {career.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Careers */}
      <section className="careers-section">
        <h2>Explore Careers</h2>
        <div className="careers-grid">
          {careers.map((career) => (
            <div key={career.id} className="career-card">
              <h3>{career.title}</h3>
              <p className="career-category">{career.category}</p>
              <p className="career-description">{career.description}</p>
              <div className="career-stats">
                <div>
                  <strong>Median Salary:</strong> {formatCurrency(career.medianSalary)}
                </div>
                <div>
                  <strong>Growth Rate:</strong> {career.growthRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Placeholder */}
      <aside className="ad-container">
        <div className="ad-placeholder">
          <p>Advertisement</p>
        </div>
      </aside>

      {/* Features */}
      <section className="features">
        <h2>Why Use RelocationLogic?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>💰 Accurate Tax Calculations</h3>
            <p>Federal, state, and local tax estimates to understand your true take-home pay.</p>
          </div>
          <div className="feature">
            <h3>🏠 Cost of Living Analysis</h3>
            <p>Compare purchasing power across cities with detailed COL breakdowns.</p>
          </div>
          <div className="feature">
            <h3>📊 Real Salary Data</h3>
            <p>Comprehensive salary information across multiple cities and careers.</p>
          </div>
          <div className="feature">
            <h3>🎯 Career Insights</h3>
            <p>Growth rates, education requirements, and career progression data.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
