import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import placeholderImage from '@/assets/images/cleaning-service-wallpaper.jpg';

const ProfessionalConduct = () => {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      // Save completion to AsyncStorage
      const stored = await AsyncStorage.getItem('onboarding_completed');
      const completed = stored ? JSON.parse(stored) : [];
      if (!completed.includes('d')) {
        completed.push('d');
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
            accessibilityLabel="Professional conduct illustration"
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-2xl font-semibold text-gray-800 mb-2">
          Professional Conduct
        </Text>
        <Text className="text-gray-600">
          Our professional standards help ensure safety and good customer
          experiences.
        </Text>
      </View>

      <View className="mt-4">
        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">
            Be respectful
          </Text>
          <Text className="text-gray-600">
            Treat customers and their homes with respect. Communicate clearly
            and courteously.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">Safety first</Text>
          <Text className="text-gray-600">
            If you encounter unsafe conditions, do not proceed — inform the
            customer and contact support if needed.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-1">
            Handle belongings carefully
          </Text>
          <Text className="text-gray-600">
            Follow instructions for handling fragile items and report any
            accidental damage immediately.
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

export default ProfessionalConduct;
