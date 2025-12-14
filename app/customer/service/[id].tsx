import Button from '@/components/Button';
import { API_ENDPOINTS, apiCall } from '@/config/api';
import { ServiceType } from '@/types/service.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';

const ServiceDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchServiceDetail();
    }
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        API_ENDPOINTS.service.typeById(id as string),
      );
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1A78F2" />
      </View>
    );
  }

  if (!service) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-5">
        <Text className="text-gray-600 text-center">Service not found</Text>
      </View>
    );
  }

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
                source={{
                  uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Content */}
          <View className="px-5 pt-5">
            {/* Title */}
            <Text className="text-2xl font-bold text-gray-800 mb-3">
              {service.name}
            </Text>

            {/* Category & Price */}
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 px-3 py-1 rounded-full mr-3">
                <Text className="text-[#1A78F2] text-sm font-semibold">
                  {service.category.name}
                </Text>
              </View>
              <Text className="text-xl font-bold text-[#1A78F2]">
                {service.basePrice.toLocaleString()}₫
              </Text>
            </View>

            {/* Description */}
            <Text className="text-base text-gray-600 leading-6 mb-5">
              {service.description ||
                'Professional cleaning service at your home'}
            </Text>

            {/* Room Pricing Info */}
            {service.roomPricing.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Room Pricing
                </Text>
                {service.roomPricing.map((room, index) => (
                  <View
                    key={room.id}
                    className="flex-row justify-between items-center mb-2 bg-gray-50 p-3 rounded-xl"
                  >
                    <Text className="text-gray-700">
                      {room.roomType} ({room.roomCount} room
                      {room.roomCount > 1 ? 's' : ''})
                    </Text>
                    <Text className="text-[#1A78F2] font-semibold">
                      +{room.additionalPrice.toLocaleString()}₫
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Duration Pricing Info */}
            {service.durationPrice.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Duration Options
                </Text>
                {service.durationPrice.map((duration) => (
                  <View
                    key={duration.id}
                    className="flex-row justify-between items-center mb-2 bg-gray-50 p-3 rounded-xl"
                  >
                    <Text className="text-gray-700">
                      {duration.durationHours} hour
                      {duration.durationHours > 1 ? 's' : ''}
                    </Text>
                    <Text className="text-[#1A78F2] font-semibold">
                      ×{duration.priceMultiplier}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Features */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Why Choose Us
              </Text>
              <View className="flex-row mb-4">
                <View className="mr-3 mt-0.5">
                  <Text className="text-lg text-orange-500">★</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800 mb-1">
                    Professional
                  </Text>
                  <Text className="text-sm text-gray-600 leading-5">
                    Our experienced staff are carefully selected and trained to
                    provide the best service.
                  </Text>
                </View>
              </View>
              <View className="flex-row mb-4">
                <View className="mr-3 mt-0.5">
                  <Text className="text-lg text-orange-500">★</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800 mb-1">
                    Always ready
                  </Text>
                  <Text className="text-sm text-gray-600 leading-5">
                    Book it when you need it, our team is always ready to serve
                    you.
                  </Text>
                </View>
              </View>
              <View className="flex-row mb-4">
                <View className="mr-3 mt-0.5">
                  <Text className="text-lg text-orange-500">★</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800 mb-1">
                    No hidden fees
                  </Text>
                  <Text className="text-sm text-gray-600 leading-5">
                    Only pay the amount shown in the app. You will see the total
                    cost before confirming.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="px-5 pb-6 pt-4">
          <Button
            className="rounded-2xl"
            onPress={() =>
              router.push({
                pathname: '/customer/booking',
                params: { id },
              })
            }
          >
            Start the experience
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ServiceDetail;

