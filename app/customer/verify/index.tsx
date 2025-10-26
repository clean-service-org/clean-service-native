import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const VerifyPhoneScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // focus next input
      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length === 6) {
      console.log('Verify code:', code);
      router.push('/home'); // đổi route theo ý bạn
    } else {
      alert('Please enter the 6-digit code');
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-8">
      {/* Heading */}
      <View className="mb-8">
        <Text className="text-2xl font-bold text-[#1a1a1a]">Verify Code</Text>
        <Text className="text-gray-500 mt-1">
          Enter the 6-digit code we sent to your phone number
        </Text>
      </View>

      {/* OTP Inputs */}
      <View className="flex-row justify-between mb-8">
        {otp.map((digit, index) => (
          <View
            key={index}
            className="w-12 h-14 border border-gray-300 rounded-xl items-center justify-center"
          >
            <TextInput
              ref={(ref) => (inputs.current[index] = ref)}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              className="text-lg font-semibold text-gray-700 text-center"
              style={{
                lineHeight: 20,
                height: 20,
                paddingVertical: 0,
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}
            />
          </View>
        ))}
      </View>

      {/* Verify Button */}
      <Button onPress={handleSubmit} className="rounded-xl">
        <Text className="text-center text-base font-semibold">Verify</Text>
      </Button>

      {/* Resend Code */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-500">Didn’t receive the code? </Text>
        <Text className="text-[#1A78F2] font-semibold">Resend</Text>
      </View>
    </View>
  );
};

export default VerifyPhoneScreen;
