import Logo from '@/assets/images/Logo.svg';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const EmployeeSignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { returnUrl } = useLocalSearchParams();
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validate inputs
    if (!phoneNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your phone number',
        position: 'top',
        topOffset: 60,
      });
      return;
    }
    if (phoneNumber.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid phone number',
        position: 'top',
        topOffset: 60,
      });
      return;
    }
    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your password',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(phoneNumber, password, 'Helper');

      if (!result.success) {
        // Show error toast for wrong account type
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: result.error || 'An error occurred',
          position: 'top',
          topOffset: 60,
        });
        return;
      }

      // Login successful, show toast and navigate
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login successful!',
        position: 'top',
        topOffset: 60,
      });
      setTimeout(() => {
        // If there's a returnUrl, redirect there, otherwise go to employee tabs
        if (returnUrl && typeof returnUrl === 'string') {
          router.replace(returnUrl as any);
        } else {
          router.replace('/employee/(tabs)');
        }
      }, 500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'top',
        topOffset: 60,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white px-6 pt-8">
        {/* Logo */}
        <View className="flex-col justify-center items-center mb-8 gap-2">
          <Logo width={113.65} height={45} />
          <Text className="text-[#303030] text-[12px] italic font-light leading-normal tracking-[0.036px]">
            For Employee
          </Text>
        </View>

        {/* Heading */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-[#1a1a1a]">
            Welcome back,
          </Text>
          <Text className="text-gray-500">Please login</Text>
        </View>

        {/* Phone Number Input */}
        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Phone number
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14">
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              className="flex-1 text-gray-700"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Password
          </Text>
          <View className="flex-row justify-center items-center border border-gray-300 rounded-xl px-3 h-14">
            <TextInput
              key={showPassword ? 'visible' : 'hidden'}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              className="flex-1 text-gray-700"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <Button
          className="rounded-xl"
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-base font-semibold">Log in</Text>
          )}
        </Button>

        {/* Footer Links */}
        <View className="justify-end px-5 pt-8 mb-10 flex-1">
          <View className="flex-row justify-center mb-3">
            <Text className="text-gray-500">Want to join us? </Text>
            <TouchableOpacity onPress={() => router.push('/employee/signup')}>
              <Text className="text-[#1A78F2] font-semibold">See how</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/customer/(auth)/login')}
          >
            <Text className="text-gray-600 text-center">
              Are you a customer?{' '}
              <Text className="text-[#1A78F2] font-semibold">Sign in here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmployeeSignInPage;
