import { BudgetConfig, Transaction, BudgetSummary, PeriodType } from '../types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, differenceInDays, addDays } from 'date-fns';

export function getPeriodBounds(periodType: PeriodType, referenceDate: Date = new Date()): { start: Date; end: Date } {
  switch (periodType) {
    case 'daily':
      return { start: startOfDay(referenceDate), end: endOfDay(referenceDate) };
    case 'weekly':
      return { start: startOfWeek(referenceDate, { weekStartsOn: 1 }), end: endOfWeek(referenceDate, { weekStartsOn: 1 }) };
    case 'monthly':
    default:
      return { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate) };
  }
}

export function filterTransactionsForPeriod(
  transactions: Transaction[],
  periodType: PeriodType,
  referenceDate: Date = new Date()
): Transaction[] {
  const { start, end } = getPeriodBounds(periodType, referenceDate);
  return transactions.filter((t) =>
    isWithinInterval(new Date(t.date), { start, end })
  );
}

export function computeBudgetSummary(
  config: BudgetConfig,
  transactions: Transaction[]
): BudgetSummary {
  const now = new Date();
  const periodTransactions = filterTransactionsForPeriod(transactions, config.periodType, now);
  const spent = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
  const { start, end } = getPeriodBounds(config.periodType, now);
  const totalDays = differenceInDays(end, start) + 1;
  const elapsed = differenceInDays(now, start) + 1;
  const remaining = config.budget - spent;
  const dailyRate = elapsed > 0 ? spent / elapsed : 0;
  const projectedSpend = dailyRate * totalDays;
  const categoryTotals: Record<string, number> = {};
  periodTransactions.forEach((t) => {
    if (t.category) {
      categoryTotals[t.category] = (categoryTotals[t.category] ?? 0) + t.amount;
    }
  });

  return {
    totalBudget: config.budget,
    spent,
    remaining,
    percentUsed: config.budget > 0 ? Math.min((spent / config.budget) * 100, 100) : 0,
    projectedSpend,
    daysInPeriod: totalDays,
    daysElapsed: elapsed,
    daysRemaining: totalDays - elapsed,
    dailyBudget: config.budget / totalDays,
    dailySpend: dailyRate,
    transactions: periodTransactions,
    categoryTotals,
    isOverBudget: spent > config.budget,
    rolloverAmount: config.enableRollover ? Math.max(config.previousRemainder ?? 0, 0) : 0,
  };
}

export function computeRollover(
  config: BudgetConfig,
  transactions: Transaction[]
): number {
  const { start, end } = getPeriodBounds(config.periodType);
  const previousStart = addDays(start, -(differenceInDays(end, start) + 1));
  const prevTransactions = transactions.filter((t) =>
    isWithinInterval(new Date(t.date), { start: previousStart, end: addDays(start, -1) })
  );
  const prevSpent = prevTransactions.reduce((sum, t) => sum + t.amount, 0);
  return config.budget - prevSpent;
}

export function getSpendingTrend(
  transactions: Transaction[],
  days: number = 30
): { date: string; amount: number }[] {
  const result: { date: string; amount: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    const dayStart = startOfDay(d);
    const dayEnd = endOfDay(d);
    const amount = transactions
      .filter((t) => isWithinInterval(new Date(t.date), { start: dayStart, end: dayEnd }))
      .reduce((sum, t) => sum + t.amount, 0);
    result.push({ date: d.toISOString().split('T')[0], amount });
  }
  return result;
}
