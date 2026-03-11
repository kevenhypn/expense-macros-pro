// Transaction Categories
export type SpendingCategory =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Entertainment'
  | 'Health'
  | 'Other';

export type SystemCategory = 'Bills' | 'Savings' | 'Income';

export type TransactionCategory = SpendingCategory | SystemCategory;

export const SPENDING_CATEGORIES: SpendingCategory[] = [
  'Food',
  'Shopping',
  'Transport',
  'Entertainment',
  'Health',
  'Other',
];

export const SYSTEM_CATEGORIES: SystemCategory[] = ['Bills', 'Savings', 'Income'];

export function isSpendingCategory(
  cat: TransactionCategory
): cat is SpendingCategory {
  return !SYSTEM_CATEGORIES.includes(cat as SystemCategory);
}

// Core data types
export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // positive = income, negative = expense
  category: TransactionCategory;
  note?: string;
  isSystem?: boolean;
};

export type Bill = {
  id: string;
  name: string;
  amount: number; // always positive
};

export type SavingsGoal =
  | { mode: 'percent'; percent: number }
  | { mode: 'fixed'; amount: number };

export type BudgetMode = 'fixed' | 'rollover';

export type BudgetConfig = {
  startDate: string; // YYYY-MM-DD (period anchor day, e.g. "2024-03-01")
  monthlyIncome: number;
  bills: Bill[];
  savingsGoal: SavingsGoal;
  rolloverUnspent: boolean;
};

// Computed financials
export type Financials = {
  billsTotal: number;
  savingsAmount: number;
  availableToSpend: number;
};
