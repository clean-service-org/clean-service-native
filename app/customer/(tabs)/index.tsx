import Button from '@/components/Button';

import BannerCarousel from '@/components/customer/Banner';

import ServiceGrid from '@/components/customer/ServiceGrid';

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { useRouter } from 'expo-router';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { API_ENDPOINTS, apiCall } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import type { SchedulerResponse } from '@/types/booking.types';
import type { UserProfile } from '@/types/user.types';

const HomeScreen = () => {
  const router = useRouter();
  const { userData, isAuthenticated, isLoading } = useAuth();
  const [totalBookings, setTotalBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['40%'], []);

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
  }, []);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userData?.userId) return;

      try {
        const response = await apiCall<{
          statusCode: number;
          message: string;
          data: SchedulerResponse;
        }>(API_ENDPOINTS.scheduler.byCustomerId(userData.userId));

        if (response.statusCode === 200 && response.data) {
          const bookings = response.data.results;
          setTotalBookings(bookings.length);

          // Count completed bookings
          const completed = bookings.filter(
            (booking) => booking.status.toLowerCase() === 'completed',
          ).length;
          setCompletedBookings(completed);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, [userData]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userData?.accessToken) return;

      try {
        const response = await apiCall<{
          statusCode: number;
          message: string;
          data: any;
        }>(API_ENDPOINTS.auth.me, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });

        if (response.statusCode === 200 && response.data) {
          console.log('User profile data:', response.data);
          setUserProfile(response.data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, [userData]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}

        <View className="bg-blue-400 pb-6 px-5 pt-16">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-semibold">
              {isAuthenticated
                ? `Hi ${userProfile?.fullName || 'there'}`
                : 'How are you doing today?'}
            </Text>

            {/* <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/197/197374.png',
              }} // icon UK
              className="w-6 h-6"
            /> */}
          </View>

          {/* Login Prompt for Unauthenticated Users */}
          {!isAuthenticated && (
            <View className="bg-white mt-4 p-6 rounded-2xl shadow-lg border border-blue-100">
              <Text className="text-gray-800 text-xl font-bold leading-7 mb-2">
                Discover Home Services
              </Text>
              <Text className="text-gray-600 text-sm mb-4">
                Experience professional cleaning and maintenance services at
                your doorstep
              </Text>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => router.push('/customer/(auth)/login')}
                  className="flex-1 bg-blue-500 py-3 rounded-xl active:opacity-80"
                >
                  <Text className="text-white text-center font-semibold">
                    Login
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/customer/(auth)/signup')}
                  className="flex-1 bg-white border-2 border-blue-500 py-3 rounded-xl active:opacity-80"
                >
                  <Text className="text-blue-500 text-center font-semibold">
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row items-center justify-center mt-4 gap-4">
                <View className="bg-blue-50 px-4 py-2 rounded-full">
                  <Text className="text-blue-600 text-xs font-medium">
                    ⚡ Fast Booking
                  </Text>
                </View>
                <View className="bg-green-50 px-4 py-2 rounded-full">
                  <Text className="text-green-600 text-xs font-medium">
                    ✓ Trusted Service
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* User Stats for Authenticated Users */}
          {isAuthenticated && (
            <View className="bg-white mt-3 p-4 rounded-2xl shadow-sm">
              <Text className="text-blue-500 font-semibold text-base leading-5">
                Explore the whole range of home services we are offering today!
              </Text>

              {/* Quick Stats */}

              <View className="flex-row mt-4 gap-2">
                {/* Total Bookings */}

                <View className="flex-1 bg-blue-50 p-3 rounded-xl">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-2xl mr-1">📋</Text>

                    <Text className="text-gray-600 text-xs">Bookings</Text>
                  </View>

                  <Text className="text-blue-600 text-xl font-bold">
                    {totalBookings}
                  </Text>
                </View>

                {/* Completed */}

                <View className="flex-1 bg-green-50 p-3 rounded-xl">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-2xl mr-1">✓</Text>

                    <Text className="text-gray-600 text-xs">Completed</Text>
                  </View>

                  <Text className="text-green-600 text-xl font-bold">
                    {completedBookings}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Banner */}

        <View className="px-0">
          <BannerCarousel />
        </View>

        {/* Service Section */}

        <ServiceGrid />
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        backdropComponent={backDrop}
      >
        <BottomSheetView className="px-16 py-4">
          <Text className="text-lg font-semibold text-center mb-4">
            Login or register
          </Text>

          <Button
            className="mb-3 rounded-xl"
            onPress={() => {
              router.push('/customer/(auth)/login');

              closeBottomSheet();
            }}
          >
            Log in
          </Button>

          <Button
            className="rounded-xl bg-[#f5f5f5]"
            textClassName="text-[#1a78f2]"
            onPress={() => {
              router.push('/customer/(auth)/signup');

              closeBottomSheet();
            }}
          >
            Register
          </Button>

          <View className="flex justify-center items-center gap-4 mt-4">
            <Text className="font-medium">Or login with</Text>

            <View className="flex flex-row gap-12 justify-around items-center">
              <Pressable className="flex items-center justify-center p-3 rounded-2xl border-[0.5px]">
                <Image
                  source={require('@/assets/icons/facebook-icon.png')}
                  className="w-8 h-8 rounded-full"
                />
              </Pressable>

              <Pressable className="flex items-center justify-center p-3 rounded-2xl border-[0.5px]">
                <Image
                  source={require('@/assets/icons/google-icon.png')}
                  className="w-8 h-8 rounded-full"
                />
              </Pressable>

              <Pressable className="flex items-center justify-center p-3 rounded-2xl border-[0.5px]">
                <Image
                  source={require('@/assets/icons/github-icon.png')}
                  className="w-8 h-8 rounded-full"
                />
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
