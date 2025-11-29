import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_ACTIVITY = [
  {
    id: '1',
    service: 'Cleaning on-demand',
    date: '2025-11-01 09:00',
    status: 'Completed',
    total: 200000,
  },
  {
    id: '2',
    service: 'Deep Cleaning',
    date: '2025-11-10 14:00',
    status: 'Processing',
    total: 350000,
  },
  {
    id: '3',
    service: 'Home moving',
    date: '2025-11-20 08:30',
    status: 'Scheduled',
    total: 800000,
  },
];

const Activity = () => {
  const [selected, setSelected] = useState<
    (typeof MOCK_ACTIVITY)[number] | null
  >(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

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
        data={MOCK_ACTIVITY}
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
                {item.service}
              </Text>
              <Text className="text-[#1A78F2] font-bold">
                {item.total.toLocaleString()} ₫
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">{item.date}</Text>
            <Text className="text-gray-600 mt-1 text-sm">
              Status:{' '}
              <Text
                className={
                  item.status === 'Completed'
                    ? 'text-green-600'
                    : item.status === 'Processing'
                      ? 'text-orange-500'
                      : 'text-blue-500'
                }
              >
                {item.status}
              </Text>
            </Text>
            <Text className="text-[#1A78F2] text-xs mt-2">
              Tap to see details
            </Text>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom sheet chi tiết đơn */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
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
                  {selected.service}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {selected.date}
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Status</Text>
                <Text className="text-base font-semibold text-gray-800">
                  {selected.status}
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Total</Text>
                <Text className="text-lg font-bold text-[#1A78F2]">
                  {selected.total.toLocaleString()} ₫
                </Text>
              </View>

              {/* Mock thêm vài thông tin chi tiết cho đẹp UI */}
              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Address</Text>
                <Text className="text-gray-800">
                  123 Nguyen Trai, District 1, Ho Chi Minh City
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 text-sm">Payment method</Text>
                <Text className="text-gray-800">Momo e-wallet</Text>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Activity;

