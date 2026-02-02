import { CostOfLivingCalculation } from '@/types';

/**
 * Adjust salary based on cost of living index
 * Base is 100 (national average)
 */
export function adjustSalaryForCOL(
  salary: number,
  costOfLivingIndex: number
): number {
  // If COL index is higher, purchasing power is lower
  return (salary * 100) / costOfLivingIndex;
}

/**
 * Calculate estimated monthly expenses based on salary and COL
 */
export function calculateMonthlyExpenses(
  salary: number,
  costOfLivingIndex: number,
  monthlyRent: number
): number {
  // Estimate expenses as 70% of monthly income (excluding rent)
  const monthlyIncome = salary / 12;
  const otherExpenses = (monthlyIncome * 0.4 * costOfLivingIndex) / 100;
  return monthlyRent + otherExpenses;
}

/**
 * Calculate purchasing power relative to national average
 */
export function calculatePurchasingPower(
  salary: number,
  costOfLivingIndex: number
): number {
  const nationalAverageSalary = 60000; // Baseline
  const adjustedSalary = adjustSalaryForCOL(salary, costOfLivingIndex);
  return (adjustedSalary / nationalAverageSalary) * 100;
}

/**
 * Calculate comprehensive cost of living analysis
 */
export function calculateCostOfLiving(
  salary: number,
  costOfLivingIndex: number,
  monthlyRent: number
): CostOfLivingCalculation {
  const adjustedSalary = adjustSalaryForCOL(salary, costOfLivingIndex);
  const purchasingPower = calculatePurchasingPower(salary, costOfLivingIndex);
  const monthlyExpenses = calculateMonthlyExpenses(salary, costOfLivingIndex, monthlyRent);

  return {
    salary: Math.round(salary),
    adjustedSalary: Math.round(adjustedSalary),
    costOfLivingIndex: Math.round(costOfLivingIndex * 10) / 10,
    purchasingPower: Math.round(purchasingPower * 10) / 10,
    monthlyRent: Math.round(monthlyRent),
    monthlyExpenses: Math.round(monthlyExpenses),
  };
}

/**
 * Compare two cities' cost of living
 */
export function compareCities(
  salary: number,
  city1COL: number,
  city2COL: number
): {
  equivalentSalary: number;
  savingsPerYear: number;
  percentageDifference: number;
} {
  // How much would you need in city2 to match city1 purchasing power
  const equivalentSalary = (salary * city2COL) / city1COL;
  const savingsPerYear = salary - equivalentSalary;
  const percentageDifference = ((city2COL - city1COL) / city1COL) * 100;

  return {
    equivalentSalary: Math.round(equivalentSalary),
    savingsPerYear: Math.round(savingsPerYear),
    percentageDifference: Math.round(percentageDifference * 10) / 10,
  };
}
