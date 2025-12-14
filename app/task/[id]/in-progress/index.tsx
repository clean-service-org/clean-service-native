import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';

export default function TaskInProgressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    Alert.alert(
      'Finish Task',
      'Are you sure you want to finish this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            try {
              // TODO: Call completeTask API when ready
              // await completeTask(id);
              router.push(`/task/${id}/success` as any);
            } catch (error) {
              Alert.alert('Error', 'Failed to complete task');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md items-center">
          <View className="bg-blue-600 rounded-full w-20 h-20 items-center justify-center mb-6">
            <Ionicons name="time" size={40} color="white" />
          </View>

          <Text className="text-gray-600 text-lg font-medium mb-3">
            Time Elapsed
          </Text>

          <Text className="text-gray-900 text-6xl font-bold mb-2 tracking-wider">
            {formatTime(elapsedTime)}
          </Text>

          <View className="bg-green-100 px-4 py-2 rounded-full flex-row items-center mt-4">
            <View className="w-2 h-2 bg-green-600 rounded-full mr-2" />
            <Text className="text-green-800 font-semibold">Task in Progress</Text>
          </View>
        </View>
      </View>

      <View className="px-6 pb-6">
        <Button onPress={handleFinish} className="bg-green-600 shadow-lg">
          <View className="flex-row items-center justify-center">
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Finish Task
            </Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
