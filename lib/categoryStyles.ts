import { TransactionCategory } from '../types';

type CategoryStyle = {
  badgeBg: string;
  badgeText: string;
  selectedBg: string;
  unselectedBg: string;
  barColor: string;
  emoji: string;
  label: string;
};

export const CATEGORY_STYLES: Record<TransactionCategory, CategoryStyle> = {
  Food: {
    badgeBg: '#1a2e1a',
    badgeText: '#4ade80',
    selectedBg: '#16a34a',
    unselectedBg: '#166534',
    barColor: '#4ade80',
    emoji: '🍔',
    label: 'Food',
  },
  Shopping: {
    badgeBg: '#1a1a2e',
    badgeText: '#818cf8',
    selectedBg: '#4f46e5',
    unselectedBg: '#312e81',
    barColor: '#818cf8',
    emoji: '🛍️',
    label: 'Shopping',
  },
  Transport: {
    badgeBg: '#1f2a1a',
    badgeText: '#86efac',
    selectedBg: '#15803d',
    unselectedBg: '#14532d',
    barColor: '#86efac',
    emoji: '🚗',
    label: 'Transport',
  },
  Entertainment: {
    badgeBg: '#2d1a2e',
    badgeText: '#d946ef',
    selectedBg: '#a21caf',
    unselectedBg: '#701a75',
    barColor: '#d946ef',
    emoji: '🎬',
    label: 'Entertainment',
  },
  Health: {
    badgeBg: '#1a2a2e',
    badgeText: '#22d3ee',
    selectedBg: '#0891b2',
    unselectedBg: '#164e63',
    barColor: '#22d3ee',
    emoji: '💊',
    label: 'Health',
  },
  Other: {
    badgeBg: '#1f1f1f',
    badgeText: '#9ca3af',
    selectedBg: '#4b5563',
    unselectedBg: '#1f2937',
    barColor: '#9ca3af',
    emoji: '📦',
    label: 'Other',
  },
  Bills: {
    badgeBg: '#2e1a1a',
    badgeText: '#f87171',
    selectedBg: '#dc2626',
    unselectedBg: '#7f1d1d',
    barColor: '#f87171',
    emoji: '🧾',
    label: 'Bills',
  },
  Savings: {
    badgeBg: '#1a2530',
    badgeText: '#38bdf8',
    selectedBg: '#0284c7',
    unselectedBg: '#0c4a6e',
    barColor: '#38bdf8',
    emoji: '🏦',
    label: 'Savings',
  },
  Income: {
    badgeBg: '#1a2e1f',
    badgeText: '#10b981',
    selectedBg: '#059669',
    unselectedBg: '#064e3b',
    barColor: '#10b981',
    emoji: '💰',
    label: 'Income',
  },
};

export const getCategoryStyle = (cat: TransactionCategory): CategoryStyle =>
  CATEGORY_STYLES[cat];
