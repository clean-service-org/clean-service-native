import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Task } from '../../../../types/task.types';

export default function TaskStartScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch task data from API
  const task: Task = {
    id: id || '1',
    title: 'Clean Office Space',
    description: 'Deep cleaning of the main office area including desks, floors, and windows.',
    location: '123 Business St, Office Building A',
    priority: 'HIGH',
    materials: ['All-purpose cleaner', 'Microfiber cloths', 'Vacuum cleaner', 'Glass cleaner'],
    status: 'ACCEPTED',
    assignedAt: new Date().toISOString(),
    acceptedAt: new Date().toISOString(),
  };

  const handleStart = async () => {
    try {
      setIsLoading(true);
      // TODO: Call API POST /tasks/:id/start
      // const response = await fetch(`/api/tasks/${id}/start`, { method: 'POST' });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push(`/task/${id}/in-progress` as any);
    } catch (error) {
      Alert.alert('Error', 'Failed to start task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Task Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {task.title}
        </Text>

        {/* Instructions Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={24} color="#1A78F2" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Before You Start
            </Text>
          </View>
          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-blue-900 leading-6">
              Please review the task details and ensure you have all necessary materials before starting.
            </Text>
          </View>
        </View>

        {/* Task Details */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Task Details
          </Text>
          
          {/* Location */}
          {task.location && (
            <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-lg">
              <Ionicons name="location" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-sm font-medium mb-1">Location</Text>
                <Text className="text-gray-900">{task.location}</Text>
              </View>
            </View>
          )}

          {/* Description */}
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <Text className="text-gray-600 text-sm font-medium mb-1">Description</Text>
            <Text className="text-gray-900 leading-6">{task.description}</Text>
          </View>
        </View>

        {/* Materials Checklist */}
        {task.materials && task.materials.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Materials Checklist
            </Text>
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-600 text-sm mb-3">
                Ensure you have the following materials:
              </Text>
              {task.materials.map((material, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <View className="w-5 h-5 rounded border-2 border-gray-300 mr-3" />
                  <Text className="text-gray-900 flex-1">{material}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Safety Guidelines */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Safety Guidelines
            </Text>
          </View>
          <View className="bg-green-50 p-4 rounded-lg">
            <View className="flex-row items-start mb-2">
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text className="text-green-900 ml-2 flex-1">
                Wear appropriate protective equipment
              </Text>
            </View>
            <View className="flex-row items-start mb-2">
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text className="text-green-900 ml-2 flex-1">
                Follow proper handling instructions for cleaning materials
              </Text>
            </View>
            <View className="flex-row items-start">
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text className="text-green-900 ml-2 flex-1">
                Report any safety concerns immediately
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          onPress={handleStart}
          disabled={isLoading}
          className="bg-green-600"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold">Starting...</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="play-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Start Task</Text>
            </View>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
