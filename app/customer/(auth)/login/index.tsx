import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
      await login(phoneNumber, password);
      // Đăng nhập thành công, hiển thị toast và chuyển trang
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login successful!',
        position: 'top',
        topOffset: 60,
      });
      setTimeout(() => {
        router.replace('/customer');
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
    <View className="flex-1 bg-white px-6 pt-8">
      {/* Heading */}
      <View className="mb-8">
        <Text className="text-2xl font-bold text-[#1a1a1a]">Welcome back,</Text>
        <Text className="text-gray-500">Please login</Text>
      </View>

      {/* Phone Number Input */}
      <View className="mb-5">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Phone number
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 h-14">
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
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2.5 h-14">
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
      <Button className="rounded-xl" onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-base font-semibold">Log in</Text>
        )}
      </Button>

      {/* Footer Links */}
      <View className="justify-end px-5 pt-8 mb-10 flex-1">
        <View className="flex-row justify-center mb-3">
          <Text className="text-gray-500">Do not have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/customer/signup')}>
            <Text className="text-[#1A78F2] font-semibold">Create Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Text className="text-[#1A78F2] text-center">Forgot password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
