import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Account = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
        <Text className="text-2xl font-bold text-[#1A78F2]">Account</Text>
        <Text className="text-gray-500 mt-1 text-sm">
          Manage your personal information and settings
        </Text>
      </View>

      <View className="flex-1 px-5 pt-4">
        <View className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white">
          <Text className="text-gray-500 text-xs mb-1">Name</Text>
          <Text className="font-semibold mb-3 text-gray-900">Nguyen Van A</Text>

          <Text className="text-gray-500 text-xs mb-1">Phone</Text>
          <Text className="font-semibold mb-3 text-gray-900">
            +84 912 345 678
          </Text>

          <Text className="text-gray-500 text-xs mb-1">Email</Text>
          <Text className="font-semibold text-gray-900">user@example.com</Text>
        </View>

        <View className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white">
          <Text className="text-gray-500 text-xs mb-3">Preferences</Text>
          <Text className="text-gray-800 text-sm mb-1">
            - Receive promotion notifications
          </Text>
          <Text className="text-gray-800 text-sm">
            - Remind me before booking time
          </Text>
        </View>

        <Button
          className="mb-3 rounded-xl"
          onPress={() => router.push('/customer/feedback')}
        >
          Give feedback
        </Button>

        <Button
          className="rounded-xl bg-gray-100"
          textClassName="text-red-500"
          onPress={() => router.replace('/customer/(auth)/login')}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Account;

