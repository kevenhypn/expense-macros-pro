import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppData } from '../hooks/useAppData';
import type { PeriodType } from '../types';

const STEPS = ['Welcome', 'Budget', 'Period', 'Rollover', 'Done'];

export default function SetupScreen() {
  const { saveConfig } = useAppData();
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState('');
  const [period, setPeriod] = useState<PeriodType>('monthly');
  const [rollover, setRollover] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const progress = (step / (STEPS.length - 1)) * 100;

  const handleNext = async () => {
    if (step === 1 && (isNaN(parseFloat(budget)) || parseFloat(budget) <= 0)) return;
    if (step === STEPS.length - 2) {
      await saveConfig({
        budget: parseFloat(budget),
        periodType: period,
        enableRollover: rollover,
        currency,
        setupComplete: true,
      });
      setStep(step + 1);
      return;
    }
    if (step === STEPS.length - 1) {
      router.replace('/');
      return;
    }
    setStep(step + 1);
  };

  const PERIODS: { id: PeriodType; label: string; desc: string }[] = [
    { id: 'daily', label: 'Daily', desc: 'Reset every day at midnight' },
    { id: 'weekly', label: 'Weekly', desc: 'Reset every Monday' },
    { id: 'monthly', label: 'Monthly', desc: 'Reset on the 1st of each month' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        {/* Progress */}
        <View className="h-1 bg-gray-800 mx-6 mt-4 rounded-full overflow-hidden">
          <View
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>

        <ScrollView className="flex-1 px-6 pt-8" keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <View className="items-center pt-12">
              <Text className="text-6xl mb-6">💰</Text>
              <Text className="text-white text-4xl font-bold text-center mb-4">
                Expense Macros Pro
              </Text>
              <Text className="text-gray-400 text-center text-lg leading-relaxed">
                Track your spending effortlessly with smart budgets, rollover support, and beautiful insights.
              </Text>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text className="text-white text-3xl font-bold mb-2">Set Your Budget</Text>
              <Text className="text-gray-400 mb-8">How much do you want to spend per period?</Text>
              <View className="flex-row items-center bg-gray-900 rounded-2xl px-4 py-2 mb-4">
                <Text className="text-emerald-500 text-3xl font-bold mr-2">$</Text>
                <TextInput
                  className="flex-1 text-white text-4xl font-bold"
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="decimal-pad"
                  placeholder="500"
                  placeholderTextColor="#374151"
                  autoFocus
                />
              </View>
              <Text className="text-gray-500 text-sm">You can change this anytime in Settings.</Text>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text className="text-white text-3xl font-bold mb-2">Budget Period</Text>
              <Text className="text-gray-400 mb-8">How often does your budget reset?</Text>
              {PERIODS.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setPeriod(p.id)}
                  className={`p-5 rounded-2xl mb-3 border-2 ${
                    period === p.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-800 bg-gray-900'
                  }`}
                >
                  <Text className={`font-bold text-lg ${
                    period === p.id ? 'text-emerald-400' : 'text-white'
                  }`}>{p.label}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{p.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 3 && (
            <View>
              <Text className="text-white text-3xl font-bold mb-2">Rollover Mode</Text>
              <Text className="text-gray-400 mb-8">
                Carry over unspent budget to the next period?
              </Text>
              <View className="bg-gray-900 rounded-2xl p-5 flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-white font-semibold text-lg">Enable Rollover</Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Unused budget carries forward to your next period.
                  </Text>
                </View>
                <Switch
                  value={rollover}
                  onValueChange={setRollover}
                  trackColor={{ false: '#374151', true: '#10B981' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          )}

          {step === STEPS.length - 1 && (
            <View className="items-center pt-12">
              <Text className="text-6xl mb-6">✅</Text>
              <Text className="text-white text-3xl font-bold text-center mb-4">You're all set!</Text>
              <Text className="text-gray-400 text-center text-lg">
                Your {period} budget of ${budget} is ready. Start tracking!
              </Text>
            </View>
          )}
        </ScrollView>

        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-emerald-500 py-4 rounded-2xl items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-lg">
              {step === STEPS.length - 1 ? 'Start Tracking' : 'Continue'}
            </Text>
          </TouchableOpacity>
          {step > 0 && step < STEPS.length - 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              className="items-center mt-4"
            >
              <Text className="text-gray-500">Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
