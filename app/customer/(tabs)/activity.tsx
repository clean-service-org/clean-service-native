import Logo from '@/assets/images/Logo.svg';
import { API_ENDPOINTS, apiCall } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import type {
  SchedulerBooking,
  SchedulerResponse,
} from '@/types/booking.types';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Activity = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState<SchedulerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SchedulerBooking | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userData?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiCall<{
          statusCode: number | string;
          message: string;
          data: SchedulerResponse;
        }>(API_ENDPOINTS.scheduler.byCustomerId(userData.userId));

        if (
          (response.statusCode === 200 || response.statusCode === 'OK') &&
          response.data
        ) {
          setBookings(response.data.results);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userData?.userId]);

  const backDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelected(null);
  }, []);

  // Format date time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'confirmed':
      case 'scheduled':
        return 'text-blue-500';
      case 'processing':
      case 'pending':
        return 'text-orange-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
          <Text className="text-2xl font-bold text-[#1A78F2]">Activity</Text>
          <Text className="text-gray-500 mt-1 text-sm">
            Track your recent bookings and their status
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1A78F2" />
          <Text className="text-gray-500 mt-3">Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
          <Text className="text-2xl font-bold text-[#1A78F2]">Activity</Text>
          <Text className="text-gray-500 mt-1 text-sm">
            Track your recent bookings and their status
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
        <Text className="text-2xl font-bold text-[#1A78F2]">Activity</Text>
        <Text className="text-gray-500 mt-1 text-sm">
          Track your recent bookings and their status
        </Text>
      </View>

      <FlatList
        className="flex-1 px-5 pt-4"
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setSelected(item);
              openBottomSheet();
            }}
            className="mb-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-xs active:bg-blue-50"
          >
            <View className="flex-row justify-between mb-1">
              <Text className="font-semibold text-gray-900">
                {item.serviceType.name}
              </Text>
              <Text className="text-[#1A78F2] font-bold">
                {item.totalPrice.toLocaleString()} ₫
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">
              {formatDateTime(item.scheduledStartTime)}
            </Text>
            <Text className="text-gray-600 mt-1 text-sm">
              Status:{' '}
              <Text className={getStatusColor(item.status)}>{item.status}</Text>
            </Text>
            <Text className="text-[#1A78F2] text-xs mt-2">
              Tap to see details
            </Text>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <View className="flex-col justify-center items-center mb-6 gap-2">
              <Logo width={113.65} height={45} />
              <Text className="text-[#303030] text-[12px] italic font-light leading-normal tracking-[0.036px]">
                For Customer
              </Text>
            </View>
            <Text className="text-gray-500">No bookings found</Text>
          </View>
        }
      />

      {/* Bottom sheet chi tiết đơn */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={backDrop}
        onChange={(index) => {
          if (index === -1) {
            setSelected(null);
          }
        }}
      >
        <BottomSheetView className="px-5 pt-3 pb-6">
          {selected && (
            <>
              <View className="mb-3">
                <Text className="text-lg font-bold text-[#1A78F2]">
                  {selected.serviceType.name}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {formatDateTime(selected.scheduledStartTime)}
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Status</Text>
                <Text
                  className={`text-base font-semibold ${getStatusColor(selected.status)}`}
                >
                  {selected.status}
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Total</Text>
                <Text className="text-lg font-bold text-[#1A78F2]">
                  {selected.totalPrice.toLocaleString()} ₫
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Address</Text>
                <Text className="text-gray-800">{selected.location}</Text>
              </View>

              {selected.helper && (
                <View className="mb-3">
                  <Text className="text-gray-500 text-sm">Helper</Text>
                  <Text className="text-gray-800">
                    {selected.helper.user.fullName}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {selected.helper.user.email}
                  </Text>
                </View>
              )}

              {selected.bookingDetails && (
                <View className="mb-3">
                  <Text className="text-gray-500 text-sm mb-1">
                    Room Details
                  </Text>
                  {selected.bookingDetails.bedroomCount > 0 && (
                    <Text className="text-gray-700 text-sm">
                      • Bedrooms: {selected.bookingDetails.bedroomCount}
                    </Text>
                  )}
                  {selected.bookingDetails.bathroomCount > 0 && (
                    <Text className="text-gray-700 text-sm">
                      • Bathrooms: {selected.bookingDetails.bathroomCount}
                    </Text>
                  )}
                  {selected.bookingDetails.kitchenCount > 0 && (
                    <Text className="text-gray-700 text-sm">
                      • Kitchens: {selected.bookingDetails.kitchenCount}
                    </Text>
                  )}
                  {selected.bookingDetails.livingRoomCount > 0 && (
                    <Text className="text-gray-700 text-sm">
                      • Living Rooms: {selected.bookingDetails.livingRoomCount}
                    </Text>
                  )}
                </View>
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Activity;
