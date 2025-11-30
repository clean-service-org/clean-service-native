import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Task } from '../../../../types/task.types';
export default function TaskInProgressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // TODO: Fetch task data from API
  const task: Task = {
    id: id || '1',
    title: 'Clean Office Space',
    description: 'Deep cleaning of the main office area',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString(),
  };

  // Timer
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

  const handlePause = () => {
    router.push(`/task/${id}/pause` as any);
  };

  const handleFinish = () => {
    Alert.alert(
      'Finish Task',
      'Are you sure you want to finish this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: () => router.push(`/task/${id}/finish` as any),
        },
      ]
    );
  };

  const handleAddPhoto = () => {
    // TODO: Implement image picker
    Alert.alert('Add Photo', 'Image picker will be implemented here');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Timer Section */}
        <View className="bg-blue-600 px-6 py-8">
          <Text className="text-white text-center text-sm font-medium mb-2">
            Time Elapsed
          </Text>
          <Text className="text-white text-center text-5xl font-bold">
            {formatTime(elapsedTime)}
          </Text>
          <Text className="text-blue-200 text-center text-sm mt-2">
            Task in progress...
          </Text>
        </View>

        <View className="px-6 py-4">
          {/* Task Title */}
          <Text className="text-xl font-bold text-gray-900 mb-4">
            {task.title}
          </Text>

          {/* Status Badge */}
          <View className="flex-row items-center mb-6">
            <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
              <View className="w-2 h-2 bg-green-600 rounded-full mr-2" />
              <Text className="text-green-800 font-semibold text-sm">
                In Progress
              </Text>
            </View>
          </View>

          {/* Notes Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="document-text" size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">
                Task Notes
              </Text>
            </View>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about your progress, observations, or issues..."
              multiline
              numberOfLines={4}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-900"
              textAlignVertical="top"
            />
          </View>

          {/* Photos Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="camera" size={20} color="#6B7280" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Progress Photos
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleAddPhoto}
                className="bg-blue-100 px-3 py-1 rounded-lg"
              >
                <Text className="text-blue-600 font-semibold">+ Add Photo</Text>
              </TouchableOpacity>
            </View>

            {photos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {photos.map((photo, index) => (
                  <View key={index} className="mr-3">
                    <Image
                      source={{ uri: photo }}
                      className="w-24 h-24 rounded-lg"
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 items-center">
                <Ionicons name="images-outline" size={32} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm mt-2">
                  No photos added yet
                </Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Quick Actions
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-gray-50 p-4 rounded-lg mr-2 items-center"
                onPress={handleAddPhoto}
              >
                <Ionicons name="camera-outline" size={24} color="#6B7280" />
                <Text className="text-gray-700 text-sm mt-1">Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-50 p-4 rounded-lg ml-2 items-center"
                onPress={() => {}}
              >
                <Ionicons name="call-outline" size={24} color="#6B7280" />
                <Text className="text-gray-700 text-sm mt-1">Call Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <View className="flex-row">
          <Button
            onPress={handlePause}
            className="flex-1 mr-2 bg-yellow-500"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="pause-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Pause</Text>
            </View>
          </Button>
          <Button
            onPress={handleFinish}
            className="flex-1 ml-2 bg-green-600"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Finish</Text>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
