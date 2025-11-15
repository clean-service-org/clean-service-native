import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ServiceGrid = () => {
  const services = [
    { title: 'Cleaning\non-demand', icon: '🧹', isNew: false },
    { title: 'Cleaning\nmonthly', icon: '📋', isNew: false },
    { title: 'Deep\nCleaning', icon: '🧴', isNew: false },
    { title: 'Home moving', icon: '🚚', isNew: true },
    { title: 'Industrial\nCleaning', icon: '🏗️', isNew: true },
    { title: 'A/C Cleaning', icon: '❄️', isNew: false },
    { title: 'Upholstery\nService', icon: '🛋️', isNew: false },
    { title: 'Child Care', icon: '👶', isNew: false },
  ];

  return (
    <View className="px-4 mt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Service</Text>
        <View className="flex-row items-center">
          <Text className="text-green-500 text-lg font-semibold mr-2">
            See all
          </Text>
          <View className="bg-red-500 rounded-full px-2 py-0.5">
            <Text className="text-white text-xs font-bold">NEW</Text>
          </View>
        </View>
      </View>

      {/* Service Grid */}
      <View className="flex-row flex-wrap justify-between">
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            className="w-[23%] mb-4 relative"
            activeOpacity={0.7}
          >
            {/* NEW Badge */}
            {service.isNew && (
              <View className="absolute top-0 right-0 bg-red-500 rounded-full px-1.5 py-0.5 z-10">
                <Text className="text-white text-[8px] font-bold">NEW</Text>
              </View>
            )}

            {/* Card */}
            <View className="flex justify-center items-center">
              <View className="bg-blue-50 w-20 rounded-3xl items-center justify-center aspect-square">
                <Text className="text-4xl mb-2">{service.icon}</Text>
              </View>
            </View>

            {/* Title */}
            <Text className="text-gray-700 text-xs font-medium text-center mt-2 leading-4">
              {service.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ServiceGrid;
