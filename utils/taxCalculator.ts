import { TaxCalculation } from '@/types';

/**
 * Calculate federal income tax using 2024 tax brackets (single filer)
 */
export function calculateFederalTax(income: number): number {
  const brackets = [
    { max: 11600, rate: 0.10 },
    { max: 47150, rate: 0.12 },
    { max: 100525, rate: 0.22 },
    { max: 191950, rate: 0.24 },
    { max: 243725, rate: 0.32 },
    { max: 609350, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ];

  let tax = 0;
  let previousMax = 0;

  for (const bracket of brackets) {
    if (income <= previousMax) break;
    
    const taxableInBracket = Math.min(income, bracket.max) - previousMax;
    tax += taxableInBracket * bracket.rate;
    previousMax = bracket.max;
  }

  return tax;
}

/**
 * Calculate FICA taxes (Social Security + Medicare)
 */
export function calculateFICA(income: number): number {
  const socialSecurityWageBase = 160200; // 2024 limit
  const socialSecurityRate = 0.062;
  const medicareRate = 0.0145;
  const additionalMedicareRate = 0.009;
  const additionalMedicareThreshold = 200000;

  // Social Security (capped)
  const socialSecurity = Math.min(income, socialSecurityWageBase) * socialSecurityRate;

  // Medicare (no cap)
  let medicare = income * medicareRate;

  // Additional Medicare tax for high earners
  if (income > additionalMedicareThreshold) {
    medicare += (income - additionalMedicareThreshold) * additionalMedicareRate;
  }

  return socialSecurity + medicare;
}

/**
 * Calculate comprehensive tax breakdown
 */
export function calculateTax(
  grossSalary: number,
  stateTaxRate: number = 0,
  localTaxRate: number = 0
): TaxCalculation {
  const federalTax = calculateFederalTax(grossSalary);
  const stateTax = (grossSalary * stateTaxRate) / 100;
  const localTax = (grossSalary * localTaxRate) / 100;
  const ficaTax = calculateFICA(grossSalary);
  
  const totalTax = federalTax + stateTax + localTax + ficaTax;
  const netSalary = grossSalary - totalTax;
  const effectiveTaxRate = (totalTax / grossSalary) * 100;

  return {
    grossSalary,
    federalTax: Math.round(federalTax),
    stateTax: Math.round(stateTax),
    localTax: Math.round(localTax),
    ficaTax: Math.round(ficaTax),
    totalTax: Math.round(totalTax),
    netSalary: Math.round(netSalary),
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
  };
}
