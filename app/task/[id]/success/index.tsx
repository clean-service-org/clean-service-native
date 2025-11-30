import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';

export default function TaskSubmitSuccessScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate back to task list or home
    router.push('/(employee)/home' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6 py-4"
        contentContainerClassName="flex-1"
      >
        <View className="flex-1 justify-center items-center px-4">
          {/* Success Icon */}
          <View className="w-32 h-32 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </View>

          {/* Success Message */}
          <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
            Task Completed!
          </Text>
          <Text className="text-gray-600 text-center text-lg mb-8">
            Your report has been submitted successfully
          </Text>

          {/* Details */}
          <View className="w-full bg-gray-50 p-6 rounded-lg mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="document-text" size={20} color="#1A78F2" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">
                  Report Submitted
                </Text>
                <Text className="text-gray-600 text-sm">
                  Your supervisor will review it shortly
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="time" size={20} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">
                  Time Logged
                </Text>
                <Text className="text-gray-600 text-sm">
                  Your work hours have been recorded
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="trophy" size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">
                  Great Work!
                </Text>
                <Text className="text-gray-600 text-sm">
                  Keep up the excellent service
                </Text>
              </View>
            </View>
          </View>

          {/* Next Steps */}
          <View className="w-full bg-blue-50 p-4 rounded-lg mb-8">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#1A78F2" />
              <View className="ml-2 flex-1">
                <Text className="text-blue-900 font-semibold mb-1">
                  What's Next?
                </Text>
                <Text className="text-blue-800 text-sm">
                  You can now view your task history or pick up new assignments from your dashboard.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button onPress={handleContinue} className="bg-blue-600">
          <View className="flex-row items-center">
            <Ionicons name="home" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Back to Home</Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
