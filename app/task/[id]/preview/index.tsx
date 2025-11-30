import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
export default function TaskReportPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Get report data from previous screen or context
  const report = {
    taskId: id || '1',
    taskTitle: 'Clean Office Space',
    summary:
      'Completed deep cleaning of the main office area. All desks, floors, and windows have been thoroughly cleaned and sanitized.',
    photos: [],
    materialsUsed: ['All-purpose cleaner', 'Microfiber cloths', 'Vacuum cleaner', 'Glass cleaner'],
    issues: '',
    customerSignature: null,
    completedAt: new Date().toISOString(),
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // TODO: Call API POST /tasks/:id/report
      // const response = await fetch(`/api/tasks/${id}/report`, {
      //   method: 'POST',
      //   body: JSON.stringify(report),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push(`/task/${id}/success` as any);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Review Your Report
          </Text>
          <Text className="text-gray-600">
            Please review all details before submitting
          </Text>
        </View>

        {/* Task Info */}
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-blue-600 text-sm font-medium mb-1">Task</Text>
          <Text className="text-blue-900 text-lg font-semibold">
            {report.taskTitle}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="time-outline" size={16} color="#3B82F6" />
            <Text className="text-blue-700 text-sm ml-1">
              Completed {new Date(report.completedAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-900 font-semibold text-lg">Summary</Text>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={20} color="#1A78F2" />
            </TouchableOpacity>
          </View>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-900 leading-6">{report.summary}</Text>
          </View>
        </View>

        {/* Photos */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-900 font-semibold text-lg">
              Photos ({report.photos.length})
            </Text>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={20} color="#1A78F2" />
            </TouchableOpacity>
          </View>
          {report.photos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  className="w-32 h-32 rounded-lg mr-3"
                />
              ))}
            </ScrollView>
          ) : (
            <View className="bg-gray-50 p-4 rounded-lg items-center">
              <Ionicons name="images-outline" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm mt-2">No photos added</Text>
            </View>
          )}
        </View>

        {/* Materials Used */}
        {report.materialsUsed && report.materialsUsed.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-900 font-semibold text-lg">
                Materials Used
              </Text>
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="create-outline" size={20} color="#1A78F2" />
              </TouchableOpacity>
            </View>
            <View className="bg-gray-50 p-4 rounded-lg">
              {report.materialsUsed.map((material, index) => (
                <View
                  key={index}
                  className={`flex-row items-center ${
                    index !== report.materialsUsed!.length - 1 ? 'mb-2' : ''
                  }`}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text className="text-gray-900 ml-2">{material}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Issues */}
        {report.issues && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-900 font-semibold text-lg">
                Issues & Notes
              </Text>
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="create-outline" size={20} color="#1A78F2" />
              </TouchableOpacity>
            </View>
            <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <Text className="text-yellow-900">{report.issues}</Text>
            </View>
          </View>
        )}

        {/* Customer Signature */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-900 font-semibold text-lg">
              Customer Signature
            </Text>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={20} color="#1A78F2" />
            </TouchableOpacity>
          </View>
          {report.customerSignature ? (
            <View className="bg-gray-50 p-4 rounded-lg">
              <Image
                source={{ uri: report.customerSignature }}
                className="w-full h-32"
                resizeMode="contain"
              />
            </View>
          ) : (
            <View className="bg-gray-50 p-4 rounded-lg items-center">
              <Ionicons name="create-outline" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm mt-2">
                No signature provided
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="bg-green-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-start">
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <View className="ml-2 flex-1">
              <Text className="text-green-900 font-semibold mb-1">
                Ready to Submit
              </Text>
              <Text className="text-green-800 text-sm">
                Once submitted, this report will be sent to your supervisor for review.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          onPress={handleSubmit}
          disabled={isLoading}
          className="bg-green-600"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold">Submitting...</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Submit Report</Text>
            </View>
          )}
        </Button>
        <Button
          onPress={handleEdit}
          disabled={isLoading}
          className="mt-3 bg-white border border-gray-300"
        >
          <Text className="text-gray-700 font-bold">Edit Report</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
