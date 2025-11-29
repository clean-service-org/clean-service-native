import InputWithLabel from '@/components/Input';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';

const Register = () => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (!isChecked) {
      alert('Please agree with Terms & Policy to continue');
      return;
    }
    // TODO: validate + call API đăng ký, gửi OTP
    router.push('/customer/(auth)/verify');
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 h-full bg-white px-5 pt-8">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1a1a1a] mb-1">
            Welcome to Clean Service
          </Text>
          <Text className="text-gray-500">
            Create account to use our service
          </Text>
        </View>

        <View className="space-y-4 mb-6">
          <InputWithLabel label="First and last name" placeholder="John Doe" />

          {/* Phone number input */}
          <View>
            <InputWithLabel label="Phone number" placeholder="362621210" />
          </View>

          <InputWithLabel label="Email" placeholder="johndoe@gmail.com" />
          <InputWithLabel label="Referral code (if any)" placeholder="123456" />
        </View>
      </View>

      <View className="justify-end px-5 pt-8 mb-10">
        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className="flex-row flex-1 items-center justify-center"
            activeOpacity={0.7}
          >
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? '#1A78F2' : undefined}
              style={{ marginRight: 12 }}
            />
            <Text className="text-gray-500 flex-shrink">
              I agree with these
              <Text className="text-primary"> Terms</Text> &
              <Text className="text-primary"> Policy</Text> of Clean Service
            </Text>
          </TouchableOpacity>

          <Pressable
            onPress={handleContinue}
            className={`flex items-center justify-center rounded-lg ${
              isChecked ? 'bg-blue-500' : 'bg-gray-300'
            } w-16 h-16`}
          >
            <Image
              source={require('@/assets/icons/arrow-right.png')}
              className="w-8 h-8 rounded-full"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Register;
