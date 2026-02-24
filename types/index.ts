export interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  population: number;
  medianHomePrice: number;
  costOfLivingIndex: number; // 100 = national average
  stateTaxRate: number; // percentage
  localTaxRate: number; // percentage
  salesTaxRate: number;
  averageRent: number;
  latitude: number;
  longitude: number;
}

export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  medianSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
  // Optional manual overrides to adjust salary generation per career
  salaryMultiplier?: number; // e.g., 1.1 to increase median by 10%
  overrideSalary?: number; // absolute salary to use instead of computed
  growthRate: number; // percentage
  requiredEducation: string;
}

export interface SalaryData {
  cityId: string;
  careerId: string;
  salary: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
}

export interface TaxCalculation {
  grossSalary: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  ficaTax: number;
  totalTax: number;
  netSalary: number;
  effectiveTaxRate: number;
}

export interface CostOfLivingCalculation {
  salary: number;
  adjustedSalary: number;
  costOfLivingIndex: number;
  purchasingPower: number;
  monthlyRent: number;
  monthlyExpenses: number;
}

export interface DatasetMeta {
  id: string;
  release: string;
  lastUpdated: string; // ISO timestamp of dataset snapshot
  retrievedAt: string; // ISO timestamp of retrieval
  sourceUrl: string;
  notes?: string;
}

export interface DataMeta {
  datasets: Record<string, DatasetMeta | undefined>;
}
