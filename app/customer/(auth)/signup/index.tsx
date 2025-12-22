import Button from '@/components/Button';
import InputWithLabel from '@/components/Input';
import { apiCall } from '@/config/api';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const Register = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleContinue = async () => {
    // Validation
    if (!fullName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your full name',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid phone number',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    if (!password.trim() || password.trim().length < 1) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a password',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    if (!isChecked) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please agree with Terms & Policy to continue',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCall('/auth/signup/mobile', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          password: password.trim(),
          userType: 'Customer',
        }),
      });

      if (response.statusCode === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created successfully!',
          position: 'top',
          topOffset: 60,
        });

        // Navigate to login
        setTimeout(() => {
          router.replace('/customer/(auth)/login');
        }, 1000);
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMessage,
        position: 'top',
        topOffset: 60,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white px-5 pt-8 pb-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1a1a1a] mb-1">
            Welcome to Clean Service
          </Text>
          <Text className="text-gray-500">
            Create account to use our service
          </Text>
        </View>

        <View className="space-y-4 mb-6">
          <InputWithLabel
            label="Full name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            editable={!isLoading}
          />

          <InputWithLabel
            label="Phone number"
            placeholder="0362621210"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            editable={!isLoading}
          />

          <InputWithLabel
            label="Email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <InputWithLabel
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <InputWithLabel
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        <View className="mb-6">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className="flex-row items-center"
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? '#1A78F2' : undefined}
              style={{ marginRight: 12 }}
              disabled={isLoading}
            />
            <Text className="text-gray-500 flex-1">
              I agree with these
              <Text className="text-[#1A78F2]"> Terms</Text> &
              <Text className="text-[#1A78F2]"> Policy</Text> of Clean Service
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          className="rounded-xl"
          onPress={handleContinue}
          disabled={isLoading || !isChecked}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-base font-semibold text-white">
              Create Account
            </Text>
          )}
        </Button>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push('/customer/(auth)/login')}
          >
            <Text className="text-[#1A78F2] font-semibold">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;

