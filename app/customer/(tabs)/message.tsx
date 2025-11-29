import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Promotion',
    content: '10% off for first booking this week.',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'System',
    content: 'Your booking #123 has been confirmed.',
    time: 'Yesterday',
  },
];

const Message = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
        <Text className="text-2xl font-bold text-[#1A78F2]">Notifications</Text>
        <Text className="text-gray-500 mt-1 text-sm">
          Updates from the system and promotions
        </Text>
      </View>

      <FlatList
        className="flex-1 px-5 pt-4"
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 p-4 rounded-2xl border border-gray-200 bg-white">
            <View className="flex-row justify-between mb-1">
              <Text className="font-semibold">{item.title}</Text>
              <Text className="text-gray-400 text-xs">{item.time}</Text>
            </View>
            <Text className="text-gray-600">{item.content}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Message;

