import React from 'react';
import { CostOfLivingCalculation } from '@/types';
import { formatCurrency } from '@/lib/data';

interface Props {
  colCalc: CostOfLivingCalculation;
}

export default function ColAnalysis({ colCalc }: Props) {
  return (
    <section className="col-section">
      <h2>Cost of Living Analysis</h2>
      <div className="calculation-details">
        <div className="calc-row">
          <span>Cost of Living Index:</span>
          <strong>{colCalc.costOfLivingIndex}</strong>
          <small>(100 = National Average)</small>
        </div>
        <div className="calc-row">
          <span>Adjusted Salary (National COL):</span>
          <span>{formatCurrency(colCalc.adjustedSalary)}</span>
        </div>
        <div className="calc-row">
          <span>Average Monthly Rent:</span>
          <span>{formatCurrency(colCalc.monthlyRent)}</span>
        </div>
        <div className="calc-row">
          <span>Estimated Monthly Expenses:</span>
          <strong>{formatCurrency(colCalc.monthlyExpenses)}</strong>
        </div>
        <div className="calc-row">
          <span>Purchasing Power:</span>
          <strong>{colCalc.purchasingPower}</strong>
        </div>
      </div>
    </section>
  );
}
