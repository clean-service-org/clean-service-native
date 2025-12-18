import { API_ENDPOINTS, apiCall } from '@/config/api';
import { ServiceType, ServiceTypeResponse } from '@/types/service.types';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

// Icon mapping for service types with MaterialCommunityIcons

const SERVICE_ICONS: Record<
  string,
  {
    name: string;
    library: string;
    color: string;
  }
> = {
  Standard: {
    name: 'broom',
    library: 'MaterialCommunityIcons',
    color: '#FB923C', // cam nhạt
  },

  'Deep Clean': {
    name: 'spray',
    library: 'MaterialCommunityIcons',
    color: '#F97316',
  },

  'Post Party': {
    name: 'bottle-wine',
    library: 'MaterialCommunityIcons',
    color: '#EC4899',
  },

  'Post Construction': {
    name: 'hard-hat',
    library: 'FontAwesome5',
    color: '#F59E0B',
  },

  Monthly: {
    name: 'calendar-month-outline',
    library: 'MaterialCommunityIcons',
    color: '#34D399',
  },

  'Home Moving': {
    name: 'truck-outline',
    library: 'MaterialCommunityIcons',
    color: '#FB7185',
  },

  'Industrial Cleaning': {
    name: 'factory',
    library: 'MaterialCommunityIcons',
    color: '#818CF8',
  },

  'A/C Cleaning': {
    name: 'air-conditioner',
    library: 'MaterialCommunityIcons',
    color: '#38BDF8', // giống icon máy lạnh hình bạn gửi
  },

  Upholstery: {
    name: 'sofa-outline',
    library: 'MaterialCommunityIcons',
    color: '#FDBA74',
  },

  'Child Care': {
    name: 'mother-nurse',
    library: 'MaterialCommunityIcons',
    color: '#F9A8D4',
  },
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

  const getServiceIcon = (name: string) => {
    return (
      SERVICE_ICONS[name] || {
        name: 'wrench',
        library: 'MaterialCommunityIcons' as const,
        color: '#6B7280',
      }
    );
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
                {(() => {
                  const icon = getServiceIcon(service.name);
                  const IconComponent =
                    icon.library === 'MaterialCommunityIcons'
                      ? MaterialCommunityIcons
                      : icon.library === 'FontAwesome5'
                        ? FontAwesome5
                        : Ionicons;
                  return (
                    <IconComponent
                      name={icon.name}
                      size={36}
                      color={icon.color}
                    />
                  );
                })()}
              </View>
            </View>

            {/* Title */}
            <Text className="text-gray-700 text-xs font-medium text-center mt-2 leading-4">
              {service.name}
            </Text>

            {/* Price */}
            {/* <Text className="text-[#1A78F2] text-[10px] font-semibold text-center mt-1">
              {service.basePrice.toLocaleString()}₫
            </Text> */}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ServiceGrid;
