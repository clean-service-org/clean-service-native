import { API_ENDPOINTS, apiCall } from '@/config/api';
import { ServiceType, ServiceTypeResponse } from '@/types/service.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

// Icon mapping for service types
const SERVICE_ICONS: Record<string, string> = {
  Standard: '🧹',
  'Deep Clean': '🧴',
  'Post Party': '🎉',
  'Post Construction': '🏗️',
  Monthly: '📋',
  'Home Moving': '🚚',
  Industrial: '🏭',
  'A/C Cleaning': '❄️',
  Upholstery: '🛋️',
  'Child Care': '👶',
};

const ServiceGrid = () => {
  const router = useRouter();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ServiceTypeResponse = await apiCall(
        API_ENDPOINTS.service.types,
      );
      setServices(response.data.results);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (name: string): string => {
    return SERVICE_ICONS[name] || '🔧';
  };

  if (loading) {
    return (
      <View className="px-4 mt-6 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#1A78F2" />
        <Text className="text-gray-500 mt-3">Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-4 mt-6">
        <View className="bg-red-50 border border-red-200 rounded-xl p-4">
          <Text className="text-red-600 text-center">{error}</Text>
          <TouchableOpacity
            onPress={fetchServices}
            className="mt-3 bg-red-500 rounded-lg py-2"
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="px-4 mt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Service</Text>
        <View className="flex-row items-center">
          <Text className="text-green-500 text-lg font-semibold mr-2">
            {services.length} available
          </Text>
        </View>
      </View>

      {/* Service Grid */}
      <View className="flex-row flex-wrap justify-between">
        {services.map((service, index) => (
          <TouchableOpacity
            key={service.id}
            className="w-[23%] mb-4"
            activeOpacity={0.7}
            onPress={() => {
              router.push(`/customer/service/${service.id}`);
            }}
          >
            {/* Card */}
            <View className="flex justify-center items-center">
              <View className="bg-blue-50 w-20 rounded-3xl items-center justify-center aspect-square">
                <Text className="text-4xl mb-2">
                  {getServiceIcon(service.name)}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text className="text-gray-700 text-xs font-medium text-center mt-2 leading-4">
              {service.name}
            </Text>

            {/* Price */}
            <Text className="text-[#1A78F2] text-[10px] font-semibold text-center mt-1">
              {service.basePrice.toLocaleString()}₫
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ServiceGrid;

