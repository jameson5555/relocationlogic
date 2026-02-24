import React from 'react';
import { SalaryData, Career } from '@/types';
import { formatCurrency } from '@/lib/data';

interface Props {
  salaryData: SalaryData;
  career: Career;
}

export default function SalaryOverview({ salaryData }: Props) {
  return (
    <section className="salary-overview">
      <h2>Salary Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Median Salary</div>
          <div className="stat-value">{formatCurrency(salaryData.salary)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">25th Percentile</div>
          <div className="stat-value">{formatCurrency(salaryData.percentile25)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">75th Percentile</div>
          <div className="stat-value">{formatCurrency(salaryData.percentile75)}</div>
        </div>
      </div>
    </section>
  );
}
