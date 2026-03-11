import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency, formatPercent, formatRelativeDate } from '../lib/formatters';
import { CATEGORIES } from '../lib/categoryStyles';
import type { Category } from '../types';

export default function HomeScreen() {
  const { config, summary, addTransaction, isLoading, refresh } = useAppData();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('food');
  const [showAddForm, setShowAddForm] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  if (!isLoading && !config) {
    return <Redirect href="/setup" />;
  }

  const percentUsed = summary?.percentUsed ?? 0;
  const isOver = summary?.isOverBudget ?? false;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentUsed / 100,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentUsed]);

  const toggleForm = () => {
    const toValue = showAddForm ? 0 : 1;
    setShowAddForm(!showAddForm);
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
  };

  const handleAdd = useCallback(async () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    await addTransaction({
      id: Date.now().toString(),
      amount: parsed,
      note: note.trim(),
      category: selectedCategory,
      date: new Date().toISOString(),
    });
    setAmount('');
    setNote('');
    toggleForm();
  }, [amount, note, selectedCategory, addTransaction]);

  const progressColor = isOver ? '#EF4444' : percentUsed > 80 ? '#F59E0B' : '#10B981';
  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#10B981" />}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <Text className="text-gray-400 text-sm font-medium tracking-widest uppercase">
              {config?.periodType ?? 'monthly'} budget
            </Text>
            <Text className="text-white text-5xl font-bold mt-1">
              {formatCurrency(summary?.remaining ?? 0)}
            </Text>
            <Text className="text-gray-400 mt-1">
              remaining of {formatCurrency(summary?.totalBudget ?? 0)}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="mx-6 mb-6">
            <View className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <Animated.View
                style={{ width: barWidth, backgroundColor: progressColor, height: '100%', borderRadius: 9999 }}
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-400 text-xs">
                {formatPercent(percentUsed)} used
              </Text>
              <Text className="text-gray-400 text-xs">
                {summary?.daysRemaining ?? 0}d left
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row mx-6 mb-6 gap-3">
            <View className="flex-1 bg-gray-900 rounded-2xl p-4">
              <Text className="text-gray-400 text-xs mb-1">Spent</Text>
              <Text className="text-white font-bold text-lg">{formatCurrency(summary?.spent ?? 0)}</Text>
            </View>
            <View className="flex-1 bg-gray-900 rounded-2xl p-4">
              <Text className="text-gray-400 text-xs mb-1">Daily Avg</Text>
              <Text className="text-white font-bold text-lg">{formatCurrency(summary?.dailySpend ?? 0)}</Text>
            </View>
            <View className="flex-1 bg-gray-900 rounded-2xl p-4">
              <Text className="text-gray-400 text-xs mb-1">Projected</Text>
              <Text
                className={`font-bold text-lg ${
                  (summary?.projectedSpend ?? 0) > (summary?.totalBudget ?? 0)
                    ? 'text-red-400'
                    : 'text-white'
                }`}
              >
                {formatCurrency(summary?.projectedSpend ?? 0)}
              </Text>
            </View>
          </View>

          {/* Recent Transactions */}
          <View className="mx-6 mb-8">
            <Text className="text-white font-semibold text-base mb-3">Recent</Text>
            {(summary?.transactions ?? []).length === 0 ? (
              <Text className="text-gray-500 text-sm text-center py-8">
                No transactions yet this period
              </Text>
            ) : (
              [...(summary?.transactions ?? [])]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((t) => (
                  <View
                    key={t.id}
                    className="flex-row items-center py-3 border-b border-gray-800"
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
                        {formatRelativeDate(t.date)}
                      </Text>
                    </View>
                    <Text className="text-white font-semibold">
                      -{formatCurrency(t.amount)}
                    </Text>
                  </View>
                ))
            )}
          </View>
        </ScrollView>

        {/* Add Transaction Form */}
        {showAddForm && (
          <Animated.View
            className="bg-gray-900 rounded-t-3xl px-6 pt-4 pb-8"
            style={{ transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }] }}
          >
            <Text className="text-white font-bold text-xl mb-4">Add Expense</Text>
            <TextInput
              className="bg-gray-800 text-white text-3xl font-bold px-4 py-4 rounded-2xl mb-3"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#4B5563"
              keyboardType="decimal-pad"
              autoFocus
            />
            <TextInput
              className="bg-gray-800 text-white px-4 py-3 rounded-2xl mb-4"
              value={note}
              onChangeText={setNote}
              placeholder="Note (optional)"
              placeholderTextColor="#4B5563"
            />
            {/* Category Picker */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id as Category)}
                  className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                    selectedCategory === cat.id ? 'bg-emerald-500' : 'bg-gray-800'
                  }`}
                >
                  <Text className="text-base mr-1">{cat.emoji}</Text>
                  <Text className={selectedCategory === cat.id ? 'text-white font-semibold' : 'text-gray-400'}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={handleAdd}
              className="bg-emerald-500 py-4 rounded-2xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">Add Expense</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* FAB */}
        <TouchableOpacity
          onPress={toggleForm}
          className={`absolute bottom-8 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg ${
            showAddForm ? 'bg-gray-700' : 'bg-emerald-500'
          }`}
          activeOpacity={0.85}
        >
          <Text className="text-white text-3xl font-light">{showAddForm ? '×' : '+'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
