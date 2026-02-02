import React from 'react';
import { TaxCalculation, City } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/data';

interface Props {
  taxCalc: TaxCalculation;
  city: City;
}

export default function TaxBreakdown({ taxCalc, city }: Props) {
  return (
    <section className="tax-section">
      <h2>Tax Breakdown</h2>
      <div className="calculation-details">
        <div className="calc-row">
          <span>Gross Salary:</span>
          <strong>{formatCurrency(taxCalc.grossSalary)}</strong>
        </div>
        <div className="calc-row">
          <span>Federal Tax:</span>
          <span>{formatCurrency(taxCalc.federalTax)}</span>
        </div>
        <div className="calc-row">
          <span>State Tax ({formatPercentage(city.stateTaxRate)}):</span>
          <span>{formatCurrency(taxCalc.stateTax)}</span>
        </div>
        {city.localTaxRate > 0 && (
          <div className="calc-row">
            <span>Local Tax ({formatPercentage(city.localTaxRate)}):</span>
            <span>{formatCurrency(taxCalc.localTax)}</span>
          </div>
        )}
        <div className="calc-row">
          <span>FICA (Social Security & Medicare):</span>
          <span>{formatCurrency(taxCalc.ficaTax)}</span>
        </div>
        <div className="calc-row total">
          <span>Total Tax ({formatPercentage(taxCalc.effectiveTaxRate)}):</span>
          <strong>{formatCurrency(taxCalc.totalTax)}</strong>
        </div>
        <div className="calc-row net">
          <span>Net Annual Salary:</span>
          <strong>{formatCurrency(taxCalc.netSalary)}</strong>
        </div>
        <div className="calc-row">
          <span>Net Monthly Income:</span>
          <strong>{formatCurrency(Math.round(taxCalc.netSalary / 12))}</strong>
        </div>
      </div>
    </section>
  );
}
