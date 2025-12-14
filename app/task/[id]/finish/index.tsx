import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Task } from '../../../../types/task.types';
export default function TaskFinishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch task data from API
  const task: Task = {
    id: id || '1',
    title: 'Clean Office Space',
    description: 'Deep cleaning of the main office area',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    startedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  };

  const calculateDuration = () => {
    if (!task.startedAt) return '0h 0m';
    const start = new Date(task.startedAt);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleFinish = async () => {
    try {
      setIsLoading(true);
      // TODO: Call API POST /tasks/:id/finish
      // const response = await fetch(`/api/tasks/${id}/finish`, { method: 'POST' });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push(`/task/${id}/report` as any);
    } catch (error) {
      Alert.alert('Error', 'Failed to finish task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checklist = [
    'All assigned tasks have been completed',
    'Work area has been cleaned and organized',
    'All materials have been properly stored',
    'No equipment or tools left behind',
    'Customer has been notified (if applicable)',
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="items-center mb-8 mt-6">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            Complete Task
          </Text>
          <Text className="text-gray-600 text-center">
            Confirm that all work has been completed
          </Text>
        </View>

        {/* Task Summary */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-gray-600 text-sm mb-1">Task</Text>
          <Text className="text-gray-900 text-lg font-semibold mb-3">
            {task.title}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">Duration</Text>
            </View>
            <Text className="text-gray-900 font-semibold">
              {calculateDuration()}
            </Text>
          </View>
        </View>

        {/* Completion Checklist */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Completion Checklist
          </Text>
          <Text className="text-gray-600 text-sm mb-4">
            Please verify that the following items are complete:
          </Text>
          <View className="bg-white border border-gray-200 rounded-lg p-4">
            {checklist.map((item, index) => (
              <View
                key={index}
                className={`flex-row items-start ${
                  index !== checklist.length - 1 ? 'mb-3' : ''
                }`}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#10B981"
                  style={{ marginTop: 2 }}
                />
                <Text className="text-gray-700 ml-3 flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Next Steps */}
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#1A78F2" />
            <View className="ml-2 flex-1">
              <Text className="text-blue-900 font-semibold mb-1">
                Next Step: Task Report
              </Text>
              <Text className="text-blue-800 text-sm">
                After confirming completion, you'll create a final report with photos and details about the work performed.
              </Text>
            </View>
          </View>
        </View>

        {/* Warning */}
        <View className="bg-yellow-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-start">
            <Ionicons name="warning" size={20} color="#F59E0B" />
            <View className="ml-2 flex-1">
              <Text className="text-yellow-900 font-semibold mb-1">
                Important
              </Text>
              <Text className="text-yellow-800 text-sm">
                Once you mark this task as finished, the timer will stop and you won't be able to resume it.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          onPress={handleFinish}
          disabled={isLoading}
          className="bg-green-600"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold">Processing...</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Confirm & Continue to Report</Text>
            </View>
          )}
        </Button>
        <Button
          onPress={() => router.back()}
          disabled={isLoading}
          className="mt-3 bg-white border border-gray-300"
        >
          <Text className="text-gray-700 font-bold">Go Back</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
