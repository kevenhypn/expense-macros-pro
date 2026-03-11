import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency } from '../lib/formatters';
import type { PeriodType } from '../types';

export default function SettingsScreen() {
  const { config, saveConfig, clearAllData } = useAppData();
  const [budget, setBudget] = useState(config?.budget?.toString() ?? '');
  const [period, setPeriod] = useState<PeriodType>(config?.periodType ?? 'monthly');
  const [rollover, setRollover] = useState(config?.enableRollover ?? false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      setBudget(config.budget.toString());
      setPeriod(config.periodType);
      setRollover(config.enableRollover);
    }
  }, [config]);

  const handleSave = async () => {
    const parsed = parseFloat(budget);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount.');
      return;
    }
    await saveConfig({ ...config!, budget: parsed, periodType: period, enableRollover: rollover });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your transactions and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset Everything', style: 'destructive', onPress: clearAllData },
      ]
    );
  };

  const PERIODS: { id: PeriodType; label: string }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-white text-2xl font-bold mb-6">Settings</Text>

        {/* Budget */}
        <View className="mb-6">
          <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Budget</Text>
          <View className="bg-gray-900 rounded-2xl px-4 py-3 flex-row items-center">
            <Text className="text-emerald-500 text-2xl font-bold mr-2">$</Text>
            <TextInput
              className="flex-1 text-white text-2xl font-bold"
              value={budget}
              onChangeText={setBudget}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#374151"
            />
          </View>
        </View>

        {/* Period */}
        <View className="mb-6">
          <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Budget Period</Text>
          <View className="flex-row gap-2">
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPeriod(p.id)}
                className={`flex-1 py-3 rounded-xl items-center border-2 ${
                  period === p.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-800 bg-gray-900'
                }`}
              >
                <Text className={period === p.id ? 'text-emerald-400 font-semibold' : 'text-gray-400'}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rollover */}
        <View className="mb-6">
          <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Options</Text>
          <View className="bg-gray-900 rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-white font-medium">Rollover Mode</Text>
                <Text className="text-gray-500 text-sm mt-0.5">Carry unused budget forward</Text>
              </View>
              <Switch
                value={rollover}
                onValueChange={setRollover}
                trackColor={{ false: '#374151', true: '#10B981' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className={`py-4 rounded-2xl items-center mb-4 ${
            saved ? 'bg-green-600' : 'bg-emerald-500'
          }`}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-lg">
            {saved ? '✓ Saved!' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        {/* Danger Zone */}
        <View className="mt-4 mb-12">
          <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Danger Zone</Text>
          <TouchableOpacity
            onPress={handleReset}
            className="bg-red-500/10 border border-red-500/30 py-4 rounded-2xl items-center"
            activeOpacity={0.85}
          >
            <Text className="text-red-400 font-semibold">Reset All Data</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <Text className="text-gray-700 text-xs text-center mb-8">
          Expense Macros Pro v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
