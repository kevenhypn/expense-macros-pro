import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BudgetConfig,
  Transaction,
  Financials,
  SPENDING_CATEGORIES,
  SYSTEM_CATEGORIES,
  isSpendingCategory,
} from '../types';

const CONFIG_KEY = 'emp_budget_config_v2';
const TX_KEY = 'emp_transactions_v2';

// --- Date Utilities ---

export const getTodayISO = (): string =>
  new Date().toLocaleDateString('en-CA');

export const daysInMonth = (dateISO: string): number => {
  const d = new Date(dateISO);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

export const isSameMonth = (d1: string, d2: string): boolean =>
  d1.slice(0, 7) === d2.slice(0, 7);

export const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const formatMoney = (val: number): string => {
  const abs = Math.abs(val);
  if (abs >= 1000) {
    return `$${abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `$${abs.toFixed(2)}`;
};

export const formatMoney0 = (val: number): string =>
  `$${Math.abs(val).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

// --- Storage ---

export const loadConfig = async (): Promise<BudgetConfig | null> => {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_KEY);
    return raw ? (JSON.parse(raw) as BudgetConfig) : null;
  } catch {
    return null;
  }
};

export const saveConfig = async (config: BudgetConfig): Promise<void> => {
  await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const raw = await AsyncStorage.getItem(TX_KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
};

export const saveTransactions = async (txs: Transaction[]): Promise<void> => {
  await AsyncStorage.setItem(TX_KEY, JSON.stringify(txs));
};

// --- Financial Logic ---

export const calculateFinancials = (config: BudgetConfig): Financials => {
  const billsTotal = config.bills.reduce((s, b) => s + b.amount, 0);
  let savingsAmount = 0;
  if (config.savingsGoal.mode === 'percent') {
    savingsAmount = config.monthlyIncome * (config.savingsGoal.percent / 100);
  } else {
    savingsAmount = config.savingsGoal.amount;
  }
  const availableToSpend = config.monthlyIncome - billsTotal - savingsAmount;
  return { billsTotal, savingsAmount, availableToSpend };
};

/**
 * Calculate how much the user can spend today, accounting for rollover.
 * If rolloverUnspent is true, any unspent budget from prior days
 * rolls into future days proportionally.
 */
export const calcDailyBudget = (
  config: BudgetConfig,
  availableToSpend: number,
  netSpendingByDate: Record<string, number>,
  selectedDateISO: string
): { dailyBudget: number; overspentDays: number } => {
  const dim = daysInMonth(selectedDateISO);
  const monthPrefix = selectedDateISO.slice(0, 7);
  const selectedDay = new Date(`${selectedDateISO}T00:00:00`).getDate();
  const baseDailyBudget = availableToSpend / dim;

  if (!config.rolloverUnspent) {
    let overspentDays = 0;
    for (let day = 1; day <= dim; day++) {
      const dateISO = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const spent = -(netSpendingByDate[dateISO] ?? 0);
      if (spent > baseDailyBudget) overspentDays++;
    }
    return { dailyBudget: baseDailyBudget, overspentDays };
  }

  let remaining = availableToSpend;
  let dailyBudget = baseDailyBudget;
  let overspentDays = 0;

  for (let day = 1; day <= dim; day++) {
    const daysLeft = dim - day + 1;
    const dayBudget = remaining / daysLeft;
    const dateISO = `${monthPrefix}-${String(day).padStart(2, '0')}`;
    const spent = -(netSpendingByDate[dateISO] ?? 0);
    if (spent > dayBudget) overspentDays++;
    if (day === selectedDay) dailyBudget = dayBudget;
    remaining -= spent;
  }

  return { dailyBudget, overspentDays };
};

// --- System Transaction Management ---

export const regenerateSystemTransactions = async (
  config: BudgetConfig
): Promise<void> => {
  const existing = await loadTransactions();
  const userTxs = existing.filter((t) => !t.isSystem);
  const { savingsAmount } = calculateFinancials(config);
  const date = config.startDate;
  const system: Transaction[] = [];

  // Income
  system.push({
    id: generateId(),
    date,
    amount: config.monthlyIncome,
    category: 'Income',
    isSystem: true,
    note: 'Monthly Income',
  });

  // Bills (each as its own entry)
  config.bills.forEach((bill) => {
    system.push({
      id: generateId(),
      date,
      amount: -Math.abs(bill.amount),
      category: 'Bills',
      isSystem: true,
      note: bill.name,
    });
  });

  // Savings
  if (savingsAmount > 0) {
    system.push({
      id: generateId(),
      date,
      amount: -Math.abs(savingsAmount),
      category: 'Savings',
      isSystem: true,
      note: 'Auto Savings',
    });
  }

  await saveTransactions([...userTxs, ...system]);
};
