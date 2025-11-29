import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-3 h-14">
          <Text className="text-lg mr-2">🇻🇳</Text>
          <Text className="text-gray-700 mr-2">+84</Text>
          <TextInput
            placeholder="Enter your phone number"
            keyboardType="number-pad"
            className="flex-1 text-gray-700"
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
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            className="flex-1 text-gray-700"
            textAlignVertical="center"
            style={{ textAlignVertical: 'center', paddingVertical: 0 }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <Button
        className="rounded-xl"
        onPress={() => {
          // TODO: validate + call API đăng nhập
          // Sau khi login thành công thì vào tab chính
          router.replace('/customer');
        }}
      >
        <Text className=" text-center text-base font-semibold">Log in</Text>
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
