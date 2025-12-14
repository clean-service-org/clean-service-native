import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
export default function TaskReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [summary, setSummary] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [materialsUsed, setMaterialsUsed] = useState<string[]>([]);
  const [materialInput, setMaterialInput] = useState('');
  const [issues, setIssues] = useState('');

  const handleAddPhoto = () => {
    // TODO: Implement image picker
    Alert.alert('Add Photo', 'Image picker will be implemented here');
  };

  const handleAddMaterial = () => {
    if (materialInput.trim()) {
      setMaterialsUsed([...materialsUsed, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterialsUsed(materialsUsed.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (!summary.trim()) {
      Alert.alert('Required', 'Please provide a summary of the work completed');
      return;
    }

    if (photos.length === 0) {
      Alert.alert(
        'Add Photos',
        'It is recommended to add at least one photo. Continue anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => navigateToPreview(),
          },
        ]
      );
      return;
    }

    navigateToPreview();
  };

  const navigateToPreview = () => {
    // TODO: Pass report data to preview screen
    router.push(`/task/${id}/preview` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Task Report
          </Text>
          <Text className="text-gray-600">
            Provide details about the completed work
          </Text>
        </View>

        {/* Summary */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-900 font-semibold">Work Summary</Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <TextInput
            value={summary}
            onChangeText={setSummary}
            placeholder="Describe the work you completed, including key tasks and outcomes..."
            multiline
            numberOfLines={5}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-900"
            textAlignVertical="top"
          />
        </View>

        {/* Photos */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-semibold">Photos</Text>
              <View className="bg-blue-100 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-blue-800 text-xs font-semibold">
                  Recommended
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleAddPhoto}
              className="bg-blue-100 px-3 py-1 rounded-lg"
            >
              <Text className="text-blue-600 font-semibold">+ Add</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((photo, index) => (
                <View key={index} className="mr-3 relative">
                  <Image source={{ uri: photo }} className="w-24 h-24 rounded-lg" />
                  <TouchableOpacity
                    className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                    onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              onPress={handleAddPhoto}
              className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 items-center"
            >
              <Ionicons name="camera" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm mt-2">
                Add photos of completed work
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Materials Used */}
        <View className="mb-6">
          <Text className="text-gray-900 font-semibold mb-2">
            Materials Used
          </Text>
          <View className="flex-row mb-3">
            <TextInput
              value={materialInput}
              onChangeText={setMaterialInput}
              placeholder="Enter material name"
              className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900 mr-2"
              onSubmitEditing={handleAddMaterial}
            />
            <TouchableOpacity
              onPress={handleAddMaterial}
              className="bg-blue-600 px-4 rounded-lg items-center justify-center"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {materialsUsed.length > 0 && (
            <View className="bg-gray-50 p-3 rounded-lg">
              {materialsUsed.map((material, index) => (
                <View
                  key={index}
                  className={`flex-row items-center justify-between ${
                    index !== materialsUsed.length - 1 ? 'mb-2' : ''
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    <Text className="text-gray-900 ml-2">{material}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveMaterial(index)}>
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Issues or Notes */}
        <View className="mb-6">
          <Text className="text-gray-900 font-semibold mb-2">
            Issues or Additional Notes
          </Text>
          <TextInput
            value={issues}
            onChangeText={setIssues}
            placeholder="Report any issues, damage, or additional notes (optional)"
            multiline
            numberOfLines={4}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-900"
            textAlignVertical="top"
          />
        </View>

        {/* Customer Signature */}
        <View className="mb-6">
          <Text className="text-gray-900 font-semibold mb-2">
            Customer Signature
          </Text>
          <TouchableOpacity
            className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 items-center"
            onPress={() => Alert.alert('Signature', 'Signature pad will be implemented')}
          >
            <Ionicons name="create-outline" size={32} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm mt-2">
              Tap to get customer signature
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button onPress={handleContinue} className="bg-blue-600">
          <View className="flex-row items-center">
            <Ionicons name="arrow-forward-circle" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Preview Report</Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
