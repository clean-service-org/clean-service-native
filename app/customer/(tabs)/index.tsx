import Button from '@/components/Button';
import BannerCarousel from '@/components/customer/Banner';
import ServiceGrid from '@/components/customer/ServiceGrid';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HomeScreen = () => {
  const router = useRouter();

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

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}
        <View className="bg-blue-400 pb-6 px-5 pt-16">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-semibold">
              Hi Huy Trương Tuấn
            </Text>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/197/197374.png',
              }} // icon UK
              className="w-6 h-6"
            />
          </View>

          {/* <Button onPress={openBottomSheet}>Log in/Create account</Button> */}
          <View className="bg-white mt-3 p-4 rounded-2xl shadow-sm">
            <Text className="text-blue-500 font-semibold text-base leading-5">
              Explore the whole range of home services we are offering today!
            </Text>

            <View className="flex-row mt-4">
              {/* Left: Balance */}
              <TouchableOpacity className="flex-1 flex-row items-center justify-between pr-3">
                <View className="flex-row items-center">
                  <View className="bg-yellow-400 w-8 h-8 rounded-full items-center justify-center mr-2">
                    <Text className="text-white text-lg font-bold">₫</Text>
                  </View>
                  <Text className="text-gray-800 text-base font-semibold">
                    0 đ
                  </Text>
                </View>
                <Text className="text-gray-300 text-lg">›</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="w-px h-full bg-gray-200 mx-2" />

              {/* Right: bPoints */}
              <TouchableOpacity className="flex-1 flex-row items-center justify-between pl-3">
                <View className="flex-row items-center">
                  <View className="bg-orange-400 w-8 h-8 rounded-full items-center justify-center mr-2">
                    <Text className="text-white text-base font-bold">👤</Text>
                  </View>
                  <Text className="text-gray-800 text-base font-semibold">
                    0 bPoints
                  </Text>
                </View>
                <Text className="text-gray-300 text-lg">›</Text>
              </TouchableOpacity>
            </View>
          </View>
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
