import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency, formatDate } from '../lib/formatters';
import { CATEGORIES } from '../lib/categoryStyles';
import type { Category } from '../types';

type Filter = 'all' | Category;

export default function HistoryScreen() {
  const { transactions, deleteTransaction } = useAppData();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const base = filter === 'all' ? transactions : transactions.filter((t) => t.category === filter);
    return [...base].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  const sections = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((t) => {
      const key = formatDate(t.date, 'EEEE, MMM d');
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return Object.entries(map).map(([title, data]) => ({ title, data }));
  }, [filtered]);

  const total = useMemo(() => filtered.reduce((s, t) => s + t.amount, 0), [filtered]);

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  };

  const filterCategories: { id: Filter; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '📊' },
    ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label, emoji: c.emoji })),
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold">History</Text>
        <Text className="text-gray-400 text-sm mt-1">{filtered.length} transactions · {formatCurrency(total)}</Text>
      </View>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3 flex-grow-0">
        {filterCategories.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFilter(f.id)}
            className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
              filter === f.id ? 'bg-emerald-500' : 'bg-gray-800'
            }`}
          >
            <Text className="mr-1">{f.emoji}</Text>
            <Text className={filter === f.id ? 'text-white font-semibold' : 'text-gray-400'}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {sections.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No transactions found</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          renderSectionHeader={({ section: { title, data } }) => (
            <View className="flex-row justify-between items-center py-2 mt-2">
              <Text className="text-gray-400 font-medium text-sm">{title}</Text>
              <Text className="text-gray-500 text-sm">
                {formatCurrency(data.reduce((s, t) => s + t.amount, 0))}
              </Text>
            </View>
          )}
          renderItem={({ item: t }) => (
            <TouchableOpacity
              onLongPress={() => confirmDelete(t.id)}
              activeOpacity={0.7}
              className="flex-row items-center py-3 border-b border-gray-800/50"
            >
              <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center mr-3">
                <Text className="text-lg">
                  {CATEGORIES.find((c) => c.id === t.category)?.emoji ?? '💸'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-medium">
                  {t.note || (CATEGORIES.find((c) => c.id === t.category)?.label ?? t.category)}
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  {CATEGORIES.find((c) => c.id === t.category)?.label}
                </Text>
              </View>
              <Text className="text-white font-semibold">-{formatCurrency(t.amount)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
