import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

const ServiceDetail = () => {
  const { id } = useLocalSearchParams();

  // Dữ liệu mẫu - bạn có thể thay bằng API call
  const serviceData = {
    title: 'On-demand Child Care Service',
    description:
      'On-demand Child Care Service at home with many advantages for parents:',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
    features: [
      {
        icon: '📋',
        title: 'Professional',
        description:
          'Our experienced technician are carefully selected. They will follow the bTaskee standard process to ensure your A/C is in good condition after the service is done.',
      },
      {
        icon: '✅',
        title: 'Warranty policy',
        description:
          'If your A/C has any problem with in 7 days after the service is done, we will come back and fix it for free.',
      },
      {
        icon: '👍',
        title: 'Always ready',
        description:
          'Book it when you need it, our team is always ready to serve you',
      },
      {
        icon: '🛡️',
        title: 'No hidden fees',
        description:
          'Only pay the amount shown in the app. You will see the total cost before confirming your booking.',
      },
    ],
    availability: {
      title:
        'The service currently only supports for children aged 12 months to 11 years',
      icon: '👶',
    },
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar translucent backgroundColor="transparent" style="light" />

      {/* Overlay */}
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-30 z-0" />

      {/* Main content */}
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Header tràn lên status bar */}
          <View className="w-full h-80 bg-[#1a78f3] px-5 pt-16 pb-6">
            <View className="flex-1 bg-white rounded-3xl overflow-hidden shadow-xl">
              <Image
                source={{ uri: serviceData.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Content */}
          <View className="px-5 pt-5">
            {/* Title */}
            <Text className="text-2xl font-bold text-gray-800 mb-3">
              {serviceData.title}
            </Text>

            {/* Description */}
            <Text className="text-base text-gray-600 leading-6 mb-5">
              {serviceData.description}
            </Text>

            {/* Features */}
            {serviceData.features.map((feature, index) => (
              <View key={index} className="flex-row mb-6">
                <View className="mr-3 mt-0.5">
                  <Text className="text-lg text-orange-500">★</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800 mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-sm text-gray-600 leading-5">
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="px-5 pb-6 pt-4">
          <TouchableOpacity
            className="bg-[#1a78f3] rounded-2xl py-4 mb-2 items-center shadow-lg active:bg-[#1566d6]"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold">
              Start the experience
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ServiceDetail;
