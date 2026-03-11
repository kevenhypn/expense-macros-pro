import { useCallback, useEffect, useState } from 'react';
import { BudgetConfig, Transaction } from '../types';
import { loadConfig, loadTransactions } from '../lib/storage';

export type AppData = {
  config: BudgetConfig | null;
  transactions: Transaction[];
  setTransactions: (txs: Transaction[]) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export function useAppData(): AppData {
  const [config, setConfig] = useState<BudgetConfig | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [cfg, txs] = await Promise.all([
      loadConfig(),
      loadTransactions(),
    ]);
    setConfig(cfg);
    setTransactions(txs);
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setIsLoading(false);
    })();
  }, [refresh]);

  return { config, transactions, setTransactions, isLoading, refresh };
}
