import React from 'react';

import { Text, TextInput, TextInputProps, View } from 'react-native';

interface Props extends Omit<TextInputProps, 'className'> {
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

  multiline,

  numberOfLines,

  style,

  ...restProps
}) => {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-base font-semibold text-black mb-2">{label}</Text>
      )}

      <TextInput
        className={`w-full px-4 py-3 rounded-lg text-base text-gray-700 border 

          ${errorMessage ? 'border-red-500' : ' border-gray-300'}`}
        placeholder={placeholder}
        placeholderTextColor="#A1A1AA"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[{ textAlignVertical: multiline ? 'top' : 'center' }, style]}
        {...restProps}
      />

      {errorMessage && (
        <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
      )}

      {children}
    </View>
  );
};

export default InputWithLabel;
