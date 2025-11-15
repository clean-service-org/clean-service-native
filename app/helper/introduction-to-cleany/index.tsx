import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import placeholderImage from '@/assets/images/cleaning-service-wallpaper.jpg';

const IntroductionToCleany = () => {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      // Save completion to AsyncStorage
      const stored = await AsyncStorage.getItem('onboarding_completed');
      const completed = stored ? JSON.parse(stored) : [];
      if (!completed.includes('b')) {
        completed.push('b');
        await AsyncStorage.setItem(
          'onboarding_completed',
          JSON.stringify(completed),
        );
      }
      // Navigate back to test screen
      router.back();
    } catch (err) {
      console.warn('Error saving completion:', err);
      router.back();
    }
  };

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
            accessibilityLabel="Introduction illustration"
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-2xl font-semibold text-gray-800 mb-2">
          Introduction to Cleany
        </Text>
        <Text className="text-gray-600">
          Welcome to Cleany — your companion for reliable cleaning jobs and a
          simple way to earn.
        </Text>
      </View>

      <View className="mt-4">
        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">
            What is Cleany?
          </Text>
          <Text className="text-gray-600">
            Cleany connects local cleaners with customers who need reliable,
            verified, and trusted help for home cleaning tasks. You can accept
            jobs, manage your schedule, and get paid quickly.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">Why join?</Text>
          <Text className="text-gray-600">
            Flexible shifts, transparent pay, and a steady flow of customers.
            Build a reputation by completing jobs and receiving good ratings.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">
            Getting started
          </Text>
          <Text className="text-gray-600">
            Complete the Initial Assessment, finish your profile, and follow our
            Professional Conduct guidelines to start receiving job invitations.
          </Text>
        </View>
      </View>

      {/* Complete Button */}
      <TouchableOpacity
        onPress={handleComplete}
        className="mt-8 bg-blue-600 rounded-xl py-4 px-6 items-center shadow-md"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text className="text-white font-semibold text-lg">
          Complete Reading
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default IntroductionToCleany;
