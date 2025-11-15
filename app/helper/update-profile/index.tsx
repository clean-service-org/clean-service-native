import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emergencyContact: string;
  emergencyPhone: string;
  profilePhoto?: string;
};

const UpdateProfile = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Pick an image from the device gallery
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, profilePhoto: result.assets[0].uri });
    }
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    if (!profileData.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    if (!profileData.email.trim() || !profileData.email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    if (!profileData.phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }
    if (!profileData.address.trim()) {
      Alert.alert('Validation Error', 'Please enter your address');
      return false;
    }
    if (!profileData.city.trim()) {
      Alert.alert('Validation Error', 'Please enter your city');
      return false;
    }
    if (!profileData.emergencyContact.trim()) {
      Alert.alert('Validation Error', 'Please enter an emergency contact name');
      return false;
    }
    if (!profileData.emergencyPhone.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter an emergency contact phone',
      );
      return false;
    }
    return true;
  };

  /**
   * Submit profile and assessment data to API
   * TODO: Replace with actual API endpoint
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Load assessment results from AsyncStorage
      const assessmentResults =
        await AsyncStorage.getItem('assessment_results');

      // Prepare submission payload
      const payload = {
        profile: profileData,
        assessment: assessmentResults ? JSON.parse(assessmentResults) : null,
        submittedAt: new Date().toISOString(),
      };

      console.log('Submitting application:', payload);

      // TODO: Replace with actual API call
      // Example:
      // const response = await fetch('https://api.cleany.com/v1/applications', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Submission failed');
      // }
      //
      // const result = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mark profile update as complete
      const stored = await AsyncStorage.getItem('onboarding_completed');
      const completed = stored ? JSON.parse(stored) : [];
      if (!completed.includes('e')) {
        completed.push('e');
        await AsyncStorage.setItem(
          'onboarding_completed',
          JSON.stringify(completed),
        );
      }

      Alert.alert(
        'Success!',
        'Your application has been submitted successfully. We will review it and get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        'Failed to submit your application. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-semibold text-gray-800 mb-2">
          Update Your Profile
        </Text>
        <Text className="text-gray-600 mb-6">
          Complete your profile to submit your application to Cleany.
        </Text>

        {/* Profile Photo */}
        <View className="mb-6 items-center">
          <TouchableOpacity
            onPress={pickImage}
            className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden mb-2"
          >
            {profileData.profilePhoto ? (
              <Image
                source={{ uri: profileData.profilePhoto }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <Ionicons name="camera" size={40} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">Tap to upload photo</Text>
        </View>

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Full Name <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
            placeholder="Enter your full name"
            value={profileData.fullName}
            onChangeText={(text) =>
              setProfileData({ ...profileData, fullName: text })
            }
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Email Address <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={profileData.email}
            onChangeText={(text) =>
              setProfileData({ ...profileData, email: text })
            }
          />
        </View>

        {/* Phone */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Phone Number <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
            placeholder="(123) 456-7890"
            keyboardType="phone-pad"
            value={profileData.phone}
            onChangeText={(text) =>
              setProfileData({ ...profileData, phone: text })
            }
          />
        </View>

        {/* Address */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Street Address <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
            placeholder="123 Main St, Apt 4B"
            value={profileData.address}
            onChangeText={(text) =>
              setProfileData({ ...profileData, address: text })
            }
          />
        </View>

        {/* City */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            City <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
            placeholder="Your city"
            value={profileData.city}
            onChangeText={(text) =>
              setProfileData({ ...profileData, city: text })
            }
          />
        </View>

        {/* Emergency Contact */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Emergency Contact Name <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
            placeholder="Contact name"
            value={profileData.emergencyContact}
            onChangeText={(text) =>
              setProfileData({ ...profileData, emergencyContact: text })
            }
          />
        </View>

        {/* Emergency Phone */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Emergency Contact Phone <Text className="text-red-600">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
            placeholder="(123) 456-7890"
            keyboardType="phone-pad"
            value={profileData.emergencyPhone}
            onChangeText={(text) =>
              setProfileData({ ...profileData, emergencyPhone: text })
            }
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`rounded-xl py-4 px-6 items-center shadow-md ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600'
          }`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-500 text-center mt-4">
          <Text className="text-red-600">*</Text> All fields are required
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;
