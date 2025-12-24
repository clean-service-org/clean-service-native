import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Booking, getBookingById } from '../../api';

export default function TaskInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBookingById(id);
      console.log('Booking details:', response);
      if (response?.data) {
        setBooking(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching booking:', err);
      setError(err.message || 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push(`/task/${id}/start`);
  };

  const handleCancel = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'inprogress':
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'confirmed':
        return 'Assigned';
      case 'inprogress':
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatHour = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };
    return `${formatHour(startDate)} - ${formatHour(endDate)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1A78F2" />
          <Text className="text-gray-600 mt-4">Loading task details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-red-600 font-semibold text-lg mt-4">Error</Text>
          <Text className="text-gray-600 text-center mt-2">
            {error || 'Failed to load booking details'}
          </Text>
          <Button
            onPress={fetchBookingDetails}
            className="mt-4 bg-blue-600"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </Button>
          <Button
            onPress={handleCancel}
            className="mt-3 bg-white border border-gray-300"
          >
            <Text className="text-gray-700 font-bold">Back</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = booking.status.toLowerCase() === 'completed';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Task Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {booking.serviceType.name}
        </Text>

        {/* Status Badge */}
        <View className="flex-row items-center mb-4">
          <View className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
            <Text className={`font-semibold text-sm ${getStatusColor(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </Text>
          </View>
        </View>

        {/* Price */}
        <View className="flex-row items-center mb-4">
          <Ionicons name="cash-outline" size={20} color="#10B981" />
          <Text className="ml-2 text-green-600 font-bold text-xl">
            {booking.totalPrice.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        {/* Location */}
        <View className="flex-row items-start mb-4">
          <Ionicons name="location-outline" size={20} color="#6B7280" />
          <Text className="ml-2 text-gray-700 flex-1">{booking.location}</Text>
        </View>

        {/* Schedule */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Schedule
          </Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-700">
              {formatDate(booking.scheduledStartTime)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-700">
              {formatTime(booking.scheduledStartTime, booking.scheduledEndTime)}
            </Text>
          </View>
        </View>

        {/* Description */}
        {booking.serviceType.description && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </Text>
            <Text className="text-gray-700 leading-6">
              {booking.serviceType.description}
            </Text>
          </View>
        )}

        {/* Customer Information */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Customer Information
          </Text>
          <View className="bg-gray-50 rounded-lg p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <Text className="ml-2 text-gray-700 font-medium">
                {booking.customer.fullName}
              </Text>
            </View>
            {booking.customer.phoneNumber && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="call-outline" size={20} color="#6B7280" />
                <Text className="ml-2 text-gray-700">
                  {booking.customer.phoneNumber}
                </Text>
              </View>
            )}
            {booking.customer.email && (
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <Text className="ml-2 text-gray-700">
                  {booking.customer.email}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Special Requirements */}
        {booking.bookingDetails.specialRequirements && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Special Requirements
            </Text>
            <Text className="text-gray-700 leading-6">
              {booking.bookingDetails.specialRequirements}
            </Text>
          </View>
        )}

        {/* Information Message */}
        {!isCompleted && (
          <View className="bg-blue-50 p-4 rounded-lg mb-6">
            <Text className="text-blue-900 font-semibold mb-1">
              Task Assigned
            </Text>
            <Text className="text-blue-700 text-sm">
              This task has been assigned to you. Review the details below and continue when ready.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        {isCompleted ? (
          <View className="bg-green-50 p-4 rounded-lg mb-3">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text className="text-green-900 font-semibold ml-2">
                Task Completed
              </Text>
            </View>
            <Text className="text-green-700 text-sm mt-1">
              This task has been completed and cannot be started again.
            </Text>
          </View>
        ) : (
          <Button
            onPress={handleContinue}
            className="bg-blue-600"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="arrow-forward-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Continue to Start</Text>
            </View>
          </Button>
        )}
        <Button
          onPress={handleCancel}
          className="mt-3 bg-white border border-gray-300"
        >
          <Text className="text-gray-700 font-bold">Back</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
