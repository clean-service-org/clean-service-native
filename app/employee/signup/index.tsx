import Logo from '@/assets/images/Logo.svg';
import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EmployeeGuide = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const steps = [
        {
            title: 'Welcome!',
            icon: 'hand-left-outline',
            description: 'Thank you for your interest in joining our team as a cleaning helper.',
            content: 'We are excited to have you! To ensure quality service, we require all helpers to complete an in-person registration process.',
        },
        {
            title: 'Requirements',
            icon: 'document-text-outline',
            description: 'Please prepare the following documents:',
            content: [
                'Valid ID card or passport',
                'Proof of address',
                'Recent background check (if available)',
                'Contact information',
            ],
        },
        {
            title: 'Visit Our Office',
            icon: 'location-outline',
            description: 'Come to our office to submit your application',
            content: 'Our office is located at:\n\n📍 123 Main Street, District 1\nHo Chi Minh City, Vietnam\n\n🕐 Office Hours:\nMonday - Friday: 9:00 AM - 5:00 PM\nSaturday: 9:00 AM - 12:00 PM',
        },
        {
            title: 'Next Steps',
            icon: 'checkmark-circle-outline',
            description: 'After submitting your application:',
            content: [
                'Our team will review your documents',
                'You will receive a call within 3-5 business days',
                'Complete orientation and training',
                'Start accepting jobs!',
            ],
        },
    ];

    const currentStepData = steps[currentStep - 1];

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // On last step, go back to signin
            router.back();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-6 pt-8">
                {/* Logo */}
                <View className="flex-col justify-center items-center mb-8 gap-2">
                    <Logo width={113.65} height={45} />
                    <Text className="text-[#303030] text-[12px] italic font-light leading-normal tracking-[0.036px]">
                        For Employee
                    </Text>
                </View>

                {/* Progress Indicator */}
                <View className="flex-row justify-center items-center mb-8">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <View key={index} className="flex-row items-center">
                            <View
                                className={`w-8 h-8 rounded-full items-center justify-center ${index + 1 <= currentStep ? 'bg-[#1A78F2]' : 'bg-gray-300'
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${index + 1 <= currentStep ? 'text-white' : 'text-gray-600'
                                        }`}
                                >
                                    {index + 1}
                                </Text>
                            </View>
                            {index < totalSteps - 1 && (
                                <View
                                    className={`w-12 h-1 ${index + 1 < currentStep ? 'bg-[#1A78F2]' : 'bg-gray-300'
                                        }`}
                                />
                            )}
                        </View>
                    ))}
                </View>

                {/* Step Content */}
                <View className="mb-8">
                    {/* Icon */}
                    <View className="items-center mb-6">
                        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center">
                            <Ionicons
                                name={currentStepData.icon as any}
                                size={40}
                                color="#1A78F2"
                            />
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-[#1a1a1a] text-center mb-3">
                        {currentStepData.title}
                    </Text>

                    {/* Description */}
                    <Text className="text-base text-gray-600 text-center mb-6">
                        {currentStepData.description}
                    </Text>

                    {/* Content */}
                    <View className="bg-gray-50 rounded-2xl p-5">
                        {Array.isArray(currentStepData.content) ? (
                            <View>
                                {currentStepData.content.map((item, index) => (
                                    <View key={index} className="flex-row items-start mb-3">
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color="#10B981"
                                            style={{ marginRight: 8, marginTop: 2 }}
                                        />
                                        <Text className="flex-1 text-gray-700 text-base">
                                            {item}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-gray-700 text-base leading-6">
                                {currentStepData.content}
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Navigation Buttons */}
            <View className="px-6 pb-8 pt-4 border-t border-gray-200">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={handlePrevious}
                        className="flex-1 bg-gray-200 rounded-xl py-4 items-center justify-center"
                    >
                        <Text className="text-gray-700 font-semibold text-base">
                            {currentStep === 1 ? 'Back' : 'Previous'}
                        </Text>
                    </TouchableOpacity>

                    <Button
                        onPress={handleNext}
                        className="flex-1 rounded-xl"
                    >
                        <Text className="text-white font-semibold text-base">
                            {currentStep === totalSteps ? 'Got it!' : 'Next'}
                        </Text>
                    </Button>
                </View>

                {currentStep === 1 && (
                    <TouchableOpacity
                        onPress={() => router.push('/employee/signin')}
                        className="mt-4"
                    >
                        <Text className="text-center text-gray-600">
                            Already part of our team?{' '}
                            <Text className="text-[#1A78F2] font-semibold">Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default EmployeeGuide;
