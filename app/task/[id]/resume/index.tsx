import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Task } from '../../../../types/task.types';
export default function TaskResumeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch task data from API
  const task: Task = {
    id: id || '1',
    title: 'Clean Office Space',
    description: 'Deep cleaning of the main office area',
    priority: 'HIGH',
    status: 'PAUSED',
    pausedAt: new Date().toISOString(),
  };

  const handleResume = async () => {
    try {
      setIsLoading(true);
      // TODO: Call API POST /tasks/:id/resume
      // const response = await fetch(`/api/tasks/${id}/resume`, { method: 'POST' });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push(`/task/${id}/in-progress` as any);
    } catch (error) {
      Alert.alert('Error', 'Failed to resume task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="items-center mb-8 mt-6">
          <View className="w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="play-circle" size={48} color="#F59E0B" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            Resume Task
          </Text>
          <Text className="text-gray-600 text-center">
            Ready to continue working on this task?
          </Text>
        </View>

        {/* Task Info */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-gray-600 text-sm mb-1">Task</Text>
          <Text className="text-gray-900 text-lg font-semibold mb-3">
            {task.title}
          </Text>

          {task.pausedAt && (
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">
                Paused {new Date(task.pausedAt).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* What happens next */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            What happens next?
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                <Ionicons name="timer" size={14} color="#1A78F2" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">
                  Timer will resume
                </Text>
                <Text className="text-gray-600 text-sm">
                  The task timer will continue from where you left off
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                <Ionicons name="clipboard" size={14} color="#1A78F2" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">
                  Your progress is saved
                </Text>
                <Text className="text-gray-600 text-sm">
                  All notes and photos you've added are preserved
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                <Ionicons name="checkmark-circle" size={14} color="#1A78F2" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">
                  Complete when ready
                </Text>
                <Text className="text-gray-600 text-sm">
                  Finish the task when you're done
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#1A78F2" />
            <View className="ml-2 flex-1">
              <Text className="text-blue-900 font-semibold mb-1">
                Before you resume
              </Text>
              <Text className="text-blue-800 text-sm">
                Make sure you have all the necessary materials and are ready to continue working on the task.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          onPress={handleResume}
          disabled={isLoading}
          className="bg-green-600"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold">Resuming...</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="play-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Resume Task</Text>
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
