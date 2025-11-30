import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import {
    PauseReasonEnum,
    PauseReasonLabels,
} from '../../../../types/task.types';

export default function TaskPauseReasonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<PauseReasonEnum | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reasons = Object.values(PauseReasonEnum);

  const handleConfirm = async () => {
    if (!selectedReason) {
      Alert.alert('Required', 'Please select a pause reason');
      return;
    }

    if (selectedReason === PauseReasonEnum.OTHER && !customReason.trim()) {
      Alert.alert('Required', 'Please provide a reason');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Call API POST /tasks/:id/pause
      // const response = await fetch(`/api/tasks/${id}/pause`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     reason: selectedReason,
      //     customReason: customReason,
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Task Paused', 'Your task has been paused successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to pause task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getReasonIcon = (reason: PauseReasonEnum) => {
    switch (reason) {
      case PauseReasonEnum.WAITING_MATERIAL:
        return 'cube-outline';
      case PauseReasonEnum.CUSTOMER_NOT_HOME:
        return 'home-outline';
      case PauseReasonEnum.TECHNICAL_ISSUE:
        return 'construct-outline';
      case PauseReasonEnum.WEATHER:
        return 'rainy-outline';
      case PauseReasonEnum.OTHER:
        return 'ellipsis-horizontal-circle-outline';
      default:
        return 'pause-circle-outline';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Why are you pausing?
          </Text>
          <Text className="text-gray-600">
            Select a reason for pausing this task
          </Text>
        </View>

        {/* Reason Options */}
        <View className="mb-6">
          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              onPress={() => setSelectedReason(reason)}
              className={`flex-row items-center p-4 mb-3 rounded-lg border-2 ${
                selectedReason === reason
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                  selectedReason === reason
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedReason === reason && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Ionicons
                name={getReasonIcon(reason) as any}
                size={24}
                color={selectedReason === reason ? '#1A78F2' : '#6B7280'}
              />
              <Text
                className={`ml-3 flex-1 text-base font-medium ${
                  selectedReason === reason ? 'text-blue-900' : 'text-gray-900'
                }`}
              >
                {PauseReasonLabels[reason]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Reason Input */}
        {selectedReason === PauseReasonEnum.OTHER && (
          <View className="mb-6">
            <Text className="text-gray-900 font-semibold mb-2">
              Please specify the reason
            </Text>
            <TextInput
              value={customReason}
              onChangeText={setCustomReason}
              placeholder="Enter your reason for pausing..."
              multiline
              numberOfLines={4}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-900"
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Info Box */}
        <View className="bg-yellow-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#D97706" />
            <Text className="text-yellow-900 ml-2 flex-1 text-sm">
              The task timer will be paused. You can resume the task anytime from your task list.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          onPress={handleConfirm}
          disabled={isLoading || !selectedReason}
          className="bg-yellow-500"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold">Pausing...</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="pause-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Confirm Pause</Text>
            </View>
          )}
        </Button>
        <Button
          onPress={() => router.back()}
          disabled={isLoading}
          className="mt-3 bg-white border border-gray-300"
        >
          <Text className="text-gray-700 font-bold">Cancel</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
