import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import placeholderImage from '@/assets/images/cleaning-service-wallpaper.jpg';

const HowToGetJobs = () => {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      // Save completion to AsyncStorage
      const stored = await AsyncStorage.getItem('onboarding_completed');
      const completed = stored ? JSON.parse(stored) : [];
      if (!completed.includes('c')) {
        completed.push('c');
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
            accessibilityLabel="How to get jobs illustration"
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-2xl font-semibold text-gray-800 mb-2">
          How to Get Jobs on the App
        </Text>
        <Text className="text-gray-600">
          A short guide to help you find and accept jobs using Cleany.
        </Text>
      </View>

      <View className="mt-4">
        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">
            Keep your profile updated
          </Text>
          <Text className="text-gray-600">
            Complete your profile and add photos, a clear description of your
            experience, and any certifications. A complete profile gets more
            invitations.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">
            Respond quickly
          </Text>
          <Text className="text-gray-600">
            Enable notifications and respond to job invites quickly to increase
            your chance to get hired.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">Be reliable</Text>
          <Text className="text-gray-600">
            Show up on time, follow job instructions, and maintain
            professionalism. Good ratings and repeat customers follow.
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

export default HowToGetJobs;
