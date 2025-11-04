import Button from '@/components/Button';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

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
    <View className="flex-1 bg-[#fff]">
      <View className="flex-1 justify-center items-center">
        <View className="bg-white/90 rounded-2xl px-6 w-11/12 items-center">
          <Button onPress={openBottomSheet}>Log in/Create account</Button>
        </View>
      </View>
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
              router.push('/customer/login');
              closeBottomSheet();
            }}
          >
            Log in
          </Button>
          <Button
            className="rounded-xl bg-[#f5f5f5]"
            textClassName="text-[#1a78f2]"
            onPress={() => {
              router.push('/customer/signup');
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
