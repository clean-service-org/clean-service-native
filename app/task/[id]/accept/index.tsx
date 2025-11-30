import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Task } from '../../../../types/task.types';
export default function TaskAcceptScreen() {
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
    status: 'PENDING',
    assignedAt: new Date().toISOString(),
  };

  const handleAccept = async () => {
    try {
      setIsLoading(true);
      // TODO: Call API POST /tasks/:id/accept
      // const response = await fetch(`/api/tasks/${id}/accept`, { method: 'POST' });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push(`/task/${task.id}/start`);
    } catch (error) {
      Alert.alert('Error', 'Failed to accept task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Task Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {task.title}
        </Text>

        {/* Priority Badge */}
        <View className="flex-row items-center mb-4">
          <View className={`px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            <Text className={`font-semibold text-sm ${getPriorityColor(task.priority)}`}>
              {task.priority} Priority
            </Text>
          </View>
        </View>

        {/* Location */}
        {task.location && (
          <View className="flex-row items-start mb-4">
            <Ionicons name="location-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-700 flex-1">{task.location}</Text>
          </View>
        )}

        {/* Description */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </Text>
          <Text className="text-gray-700 leading-6">{task.description}</Text>
        </View>

        {/* Materials Required */}
        {task.materials && task.materials.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Materials Required
            </Text>
            {task.materials.map((material, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="ml-2 text-gray-700">{material}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Assigned Date */}
        {task.assignedAt && (
          <View className="flex-row items-center mb-4">
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-600">
              Assigned: {new Date(task.assignedAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Confirmation Message */}
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-blue-900 font-semibold mb-1">
            Ready to accept this task?
          </Text>
          <Text className="text-blue-700 text-sm">
            By accepting, you confirm that you have reviewed the task details and are ready to proceed.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          onPress={handleAccept}
          disabled={isLoading}
          className="bg-blue-600"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold">Accepting...</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Accept Task</Text>
            </View>
          )}
        </Button>
        <Button
          onPress={handleCancel}
          disabled={isLoading}
          className="mt-3 bg-white border border-gray-300"
        >
          <Text className="text-gray-700 font-bold">Cancel</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
