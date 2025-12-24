import Logo from '@/assets/images/Logo.svg';
import Button from '@/components/Button';

import { useAuth } from '@/contexts/AuthContext';

import { API_ENDPOINTS, apiCall } from '@/config/api';

import { useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import type { UserProfile } from '@/types/user.types';

const Account = () => {
  const router = useRouter();

  const { userData, isAuthenticated, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | ''>('');
  const [editAddress, setEditAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userData?.accessToken) {
      fetchUserProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, userData?.accessToken]);

  const fetchUserProfile = async () => {
    if (!userData?.accessToken) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.auth.me, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });

      if (result?.statusCode === 200 && result?.data) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      router.replace('/customer/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openEditModal = () => {
    if (profile) {
      setEditFullName(profile.fullName || '');
      setEditGender((profile.gender as 'Male' | 'Female') || '');
      setEditAddress(profile.address || '');
      setShowEditModal(true);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFullName('');
    setEditGender('');
    setEditAddress('');
  };

  const handleSaveProfile = async () => {
    if (!userData?.accessToken) return;

    // Validation
    if (!editFullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return;
    }

    if (!editGender) {
      Alert.alert('Validation Error', 'Please select your gender');
      return;
    }

    try {
      setIsSaving(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('FullName', editFullName.trim());
      formData.append('Gender', editGender);
      if (editAddress.trim()) {
        formData.append('Address', editAddress.trim());
      }

      const response = await fetch('https://cleanservice.app/api/auth/me', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200) {
        Alert.alert('Success', 'Profile updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              closeEditModal();
              fetchUserProfile(); // Refresh profile
            },
          },
        ]);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
          <Text className="text-2xl font-bold text-[#1A78F2]">Account</Text>

          <Text className="text-gray-500 mt-1 text-sm">
            Login to manage your account
          </Text>
        </View>

        <View className="flex-1 px-5 mt-5 justify-start items-center">
          <View className="flex-col justify-center items-center mb-8 gap-2">
            <Logo width={113.65} height={45} />
            <Text className="text-[#303030] text-[12px] italic font-light leading-normal tracking-[0.036px]">
              For Customer
            </Text>
          </View>

          <Text className="text-gray-600 text-center mb-8 text-base">
            Please login to view your account information
          </Text>

          <Button
            className="mb-3 rounded-xl w-full"
            onPress={() => router.push('/customer/(auth)/login')}
          >
            Login
          </Button>

          <Button
            className="rounded-xl bg-white border-2 border-[#1A78F2] w-full"
            textClassName="text-[#1A78F2]"
            onPress={() => router.push('/customer/(auth)/signup')}
          >
            Create Account
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
        <Text className="text-2xl font-bold text-[#1A78F2]">Account</Text>

        <Text className="text-gray-500 mt-1 text-sm">
          Manage your personal information and settings
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1A78F2" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-4">
          {!profile ? (
            <View className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white items-center">
              <Text className="text-gray-500 text-center">
                Unable to load profile information
              </Text>
            </View>
          ) : (
            <View className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white">
              {profile?.fullName && (
                <>
                  <Text className="text-gray-500 text-xs mb-1">Name</Text>

                  <Text className="font-semibold mb-3 text-gray-900">
                    {profile.fullName}
                  </Text>
                </>
              )}

              {profile?.phoneNumber && (
                <>
                  <Text className="text-gray-500 text-xs mb-1">Phone</Text>

                  <Text className="font-semibold mb-3 text-gray-900">
                    {profile.phoneNumber}
                  </Text>
                </>
              )}

              {profile?.email && (
                <>
                  <Text className="text-gray-500 text-xs mb-1">Email</Text>

                  <Text className="font-semibold mb-3 text-gray-900">
                    {profile.email}
                  </Text>
                </>
              )}

              {profile?.gender && (
                <>
                  <Text className="text-gray-500 text-xs mb-1">Gender</Text>

                  <Text className="font-semibold mb-3 text-gray-900">
                    {profile.gender}
                  </Text>
                </>
              )}

              {profile?.address && (
                <>
                  <Text className="text-gray-500 text-xs mb-1">Address</Text>

                  <Text className="font-semibold text-gray-900">
                    {profile.address}
                  </Text>
                </>
              )}
            </View>
          )}

          <Button
            className="rounded-xl bg-[#1A78F2] mb-3"
            onPress={openEditModal}
          >
            Edit Profile
          </Button>

          <Button className="rounded-xl bg-red-500 mb-6" onPress={handleLogout}>
            Logout
          </Button>
        </ScrollView>
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl px-5 pt-6 pb-8 max-h-[85%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-[#1A78F2]">
                Edit Profile
              </Text>
              <TouchableOpacity
                onPress={closeEditModal}
                disabled={isSaving}
                className="p-2"
              >
                <Text className="text-gray-500 text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Full Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={editFullName}
                  onChangeText={setEditFullName}
                  placeholder="Enter your full name"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
                  editable={!isSaving}
                />
              </View>

              {/* Gender */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Gender <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => !isSaving && setEditGender('Male')}
                    className={`flex-1 border rounded-xl px-4 py-3 flex-row items-center ${
                      editGender === 'Male'
                        ? 'border-[#1A78F2] bg-blue-50'
                        : 'border-gray-300'
                    }`}
                    activeOpacity={0.7}
                    disabled={isSaving}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                        editGender === 'Male'
                          ? 'border-[#1A78F2]'
                          : 'border-gray-300'
                      }`}
                    >
                      {editGender === 'Male' && (
                        <View className="w-3 h-3 rounded-full bg-[#1A78F2]" />
                      )}
                    </View>
                    <Text
                      className={`font-medium ${
                        editGender === 'Male'
                          ? 'text-[#1A78F2]'
                          : 'text-gray-700'
                      }`}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => !isSaving && setEditGender('Female')}
                    className={`flex-1 border rounded-xl px-4 py-3 flex-row items-center ${
                      editGender === 'Female'
                        ? 'border-[#1A78F2] bg-blue-50'
                        : 'border-gray-300'
                    }`}
                    activeOpacity={0.7}
                    disabled={isSaving}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                        editGender === 'Female'
                          ? 'border-[#1A78F2]'
                          : 'border-gray-300'
                      }`}
                    >
                      {editGender === 'Female' && (
                        <View className="w-3 h-3 rounded-full bg-[#1A78F2]" />
                      )}
                    </View>
                    <Text
                      className={`font-medium ${
                        editGender === 'Female'
                          ? 'text-[#1A78F2]'
                          : 'text-gray-700'
                      }`}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Address */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Address
                </Text>
                <TextInput
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="Enter your address"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 min-h-[80px]"
                  editable={!isSaving}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={isSaving}
                className={`rounded-xl py-3 px-4 items-center ${
                  isSaving ? 'bg-gray-400' : 'bg-[#1A78F2]'
                }`}
                activeOpacity={0.8}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={closeEditModal}
                disabled={isSaving}
                className="mt-3 py-3 px-4 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-gray-500 font-medium">Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Account;
