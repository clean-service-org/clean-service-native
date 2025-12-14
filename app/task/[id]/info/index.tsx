import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Task } from '../../../../types/task.types';

export default function TaskInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // TODO: Fetch task data from API
  const task: Task = {
    id: id || '1',
    title: 'Clean Office Space',
    description: 'Deep cleaning of the main office area including desks, floors, and windows.',
    location: '123 Business St, Office Building A',
    priority: 'HIGH',
    materials: ['All-purpose cleaner', 'Microfiber cloths', 'Vacuum cleaner', 'Glass cleaner'],
    status: 'confirmed',
    assignedAt: new Date().toISOString(),
  };

  const handleContinue = () => {
    router.push(`/task/${id}/start`);
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

        {/* Information Message */}
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-blue-900 font-semibold mb-1">
            Task Assigned
          </Text>
          <Text className="text-blue-700 text-sm">
            This task has been assigned to you. Review the details below and continue when ready.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          onPress={handleContinue}
          className="bg-blue-600"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="arrow-forward-circle" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Continue to Start</Text>
          </View>
        </Button>
        <Button
          onPress={handleCancel}
          className="mt-3 bg-white border border-gray-300"
        >
          <Text className="text-gray-700 font-bold">Back</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
