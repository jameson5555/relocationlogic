import Link from 'next/link';

export default function PlatformExplainer() {
  return (
    <div className="platform-explainer container">
      <div className="platform-inner">
        <div className="platform-text">
          <h2>About RelocationLogic</h2>
          <p>
            RelocationLogic combines public datasets and industry salary surveys to
            provide clear, localised salary estimates and cost-of-living comparisons.
            Our mission is to help professionals make data-informed relocation and
            career decisions.
          </p>
        </div>
        <div className="platform-actions">
          <Link href="/about" className="btn">About the platform</Link>
          <Link href="/methodology" className="btn btn-ghost">Methodology</Link>
        </div>
      </div>
    </div>
  );
}
