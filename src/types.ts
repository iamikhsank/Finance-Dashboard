export interface Transaction {
  id: string;
  date: string;
  month: string;
  category: string;
  description: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  name: string;
  value: number;
}

export interface MonthlyTrend {
  date: string;
  income: number;
  expense: number;
  balance: number;
}
