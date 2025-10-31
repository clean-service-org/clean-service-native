import React from 'react';
import {Text, View, Pressable} from 'react-native';

export type GenderValue = 'male' | 'female' | '';

interface GenderPickerProps {
    label?: string;
    value: GenderValue;
    onChange: (v: GenderValue) => void;
    options?: Array<{ value: Exclude<GenderValue, ''>; label: string }>;
    errorText?: string;
    disabled?: boolean;
}

const DEFAULT_OPTIONS: NonNullable<GenderPickerProps['options']> = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
];

const GenderPicker: React.FC<GenderPickerProps> = ({
                                                       label = 'Gender',
                                                       value,
                                                       onChange,
                                                       options = DEFAULT_OPTIONS,
                                                       errorText,
                                                       disabled = false,
                                                   }) => {
    return (
        <View className="w-full mb-4">
            {label ? (
                <Text className="text-base font-semibold text-black mb-2">{label}</Text>
            ) : null}

            <View className="flex-row gap-2">
                {options.map(opt => {
                    const selected = value === opt.value;
                    return (
                        <Pressable
                            key={opt.value}
                            disabled={disabled}
                            onPress={() => onChange(opt.value)}
                            className={[
                                'px-4 py-3 rounded-lg border flex-1 justify-center items-center',
                                selected ? 'bg-[#1A78F2] border-[#1A78F2]' : 'bg-white border-gray-300',
                                disabled ? 'opacity-60' : '',
                            ].join(' ')}
                        >
                            <Text className={selected ? 'text-white' : 'text-gray-700'}>
                                {opt.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {errorText ? (
                <Text className="text-sm text-red-600 mt-2">{errorText}</Text>
            ) : null}
        </View>
    );
};

export default GenderPicker;
