import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import placeholderImage from '@/assets/images/cleaning-service-wallpaper.jpg';

const items = [
  {
    id: 'a',
    title: 'Initial Assessment',
    subtitle: 'Initial Assessment',
    route: '/helper/assessment',
    locked: false,
  },
  {
    id: 'b',
    title: 'Introduction to Cleany',
    subtitle: 'Introduction to Cleany',
    route: '/helper/introduction-to-cleany',
    locked: true,
  },
  {
    id: 'c',
    title: 'How to Get Jobs on the App',
    subtitle: 'How to Get Jobs on the App',
    route: '/helper/how-to-get-jobs',
    locked: true,
  },
  {
    id: 'd',
    title: 'Professional Conduct',
    subtitle: 'Professional Conduct',
    route: '/helper/professional-conduct',
    locked: true,
  },
  {
    id: 'e',
    title: 'Update Your Profile',
    subtitle:
      'Please submit your application to Cleany to complete the process',
    route: '/helper/update-profile',
    locked: true,
  },
];

const OnboardingTestScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const completedParam = params?.completed as string | undefined;
  type OnboardItem = {
    id: string;
    title: string;
    subtitle: string;
    route?: string;
    locked: boolean;
    done?: boolean;
  };
  const [localItems, setLocalItems] = useState<OnboardItem[]>(
    items as OnboardItem[],
  );

  // Load completed items from AsyncStorage
  const loadCompletedItems = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('onboarding_completed');
      if (stored) {
        const completed = JSON.parse(stored) as string[];
        setLocalItems((prev) =>
          prev.map((it, idx) => {
            const isDone = completed.includes(it.id);
            const isUnlocked =
              idx === 0 || completed.includes(prev[idx - 1]?.id);
            return { ...it, done: isDone, locked: !isUnlocked };
          }),
        );
      }
    } catch (err) {
      console.warn('Failed to load completion state:', err);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadCompletedItems();
  }, [loadCompletedItems]);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCompletedItems();
    }, [loadCompletedItems]),
  );

  // Handle completion from query param
  useEffect(() => {
    if (!completedParam) return;

    const saveCompletion = async () => {
      try {
        // Load existing completed items
        const stored = await AsyncStorage.getItem('onboarding_completed');
        const completed = stored ? JSON.parse(stored) : [];

        // Add new completion if not already present
        if (!completed.includes(completedParam)) {
          completed.push(completedParam);
          await AsyncStorage.setItem(
            'onboarding_completed',
            JSON.stringify(completed),
          );
        }

        // Update UI state
        setLocalItems((prev) => {
          const next = prev.map((it) =>
            it.id === completedParam
              ? { ...it, done: true, locked: false }
              : it,
          );
          // Unlock the next item in the list
          const idx = prev.findIndex((it) => it.id === completedParam);
          if (idx >= 0 && idx + 1 < prev.length) {
            next[idx + 1] = { ...next[idx + 1], locked: false };
          }
          return next;
        });
      } catch (err) {
        console.warn('Failed to save completion state:', err);
      }
    };

    saveCompletion();
  }, [completedParam]);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 24 }}
    >
      <View className="items-center mb-6">
        <View className="w-full h-44 bg-gray-100 rounded-2xl overflow-hidden justify-center items-center shadow-sm">
          <Image
            source={placeholderImage}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessible
            accessibilityLabel="Illustration"
          />
        </View>
      </View>

      {/* Intro text */}
      <View className="mb-4 flex flex-col gap-6">
        <Text className="text-gray-600">
          Let&apos;s see how many housekeeping skills you have!
        </Text>

        {/* Card list */}
        <View className="flex flex-col gap-4">
          {localItems.map((it) => (
            <TouchableOpacity
              key={it.id}
              activeOpacity={0.8}
              className={`flex-row items-center rounded-xl p-4 border border-gray-200 shadow-md ${
                it.locked ? 'bg-gray-200' : 'bg-white'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
              }}
              onPress={() => {
                if (!it.locked && it.route) {
                  (router as any).push(it.route);
                }
              }}
            >
              <View className="flex-1">
                <Text
                  className={`font-semibold ${it.locked ? 'text-gray-500' : 'text-gray-800'}`}
                >
                  {it.title}
                </Text>
                <Text className="text-sm text-gray-400 mt-1">
                  {it.subtitle}
                </Text>
              </View>

              <View className="ml-3">
                {it.done ? (
                  <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                ) : it.locked ? (
                  <Ionicons name="lock-closed" size={22} color="#6B7280" />
                ) : (
                  <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default OnboardingTestScreen;
