import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface Props {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  children?: React.ReactNode;
  errorMessage?: string;
}

const InputWithLabel: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChangeText,
  children,
  errorMessage,
}) => {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-base font-semibold text-black mb-2">{label}</Text>
      )}
      <TextInput
        className={`w-full px-4 py-3 rounded-lg text-base text-gray-700 align-center border 
          ${errorMessage ? 'border-red-500' : ' border-gray-300'}`}
        placeholder={placeholder}
        placeholderTextColor="#A1A1AA"
        value={value}
        onChangeText={onChangeText}
      />
      {errorMessage && (
        <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
      )}
      {children}
    </View>
  );
};

export default InputWithLabel;
