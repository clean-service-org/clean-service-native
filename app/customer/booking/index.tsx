import Button from '@/components/Button';
import InputWithLabel from '@/components/Input';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ADD_ONS = [
  { id: 'cooking', label: 'Cooking', price: 50000 },
  { id: 'ironing', label: 'Ironing', price: 50000 },
];

const OPTIONS = [
  { id: 'pet', label: 'House with pet', price: 30000 },
];

const DURATIONS = [
  { id: '2h', label: '2 hours', price: 150000 },
  { id: '4h', label: '4 hours', price: 300000 },
];

const PAYMENT_METHODS = ['Cash', 'Momo', 'ZaloPay', 'Credit Card'];

const BookingScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [durationId, setDurationId] = useState<string>('2h');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');

  const basePrice = useMemo(
    () => DURATIONS.find((d) => d.id === durationId)?.price ?? 0,
    [durationId],
  );

  const addOnPrice = useMemo(
    () =>
      selectedAddOns.reduce(
        (sum, addOnId) =>
          sum + (ADD_ONS.find((a) => a.id === addOnId)?.price ?? 0),
        0,
      ),
    [selectedAddOns],
  );

  const optionPrice = useMemo(
    () =>
      selectedOptions.reduce(
        (sum, optionId) =>
          sum + (OPTIONS.find((o) => o.id === optionId)?.price ?? 0),
        0,
      ),
    [selectedOptions],
  );

  const total = basePrice + addOnPrice + optionPrice;

  const toggleItem = (
    list: string[],
    value: string,
    setter: (next: string[]) => void,
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleSubmit = () => {
    if (!address.trim()) {
      alert('Please enter your address');
      return;
    }

    // TODO: call API tạo booking với serviceId = id
    alert(
      `Booking success for service ${id ?? '-'}\nTotal: ${total.toLocaleString()} ₫`,
    );
    router.replace('/customer/(tabs)/activity');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView className="flex-1 px-5 pt-6 pb-32">
          {/* Địa điểm */}
          <InputWithLabel
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />
          <Text className="text-xs text-gray-400 mb-2">
            (Later: integrate Google Maps here)
          </Text>

          {/* Mock Google Map */}
          <View className="mb-6 rounded-2xl overflow-hidden border border-gray-200">
            <View className="h-40 bg-gray-200 items-center justify-center">
              <Text className="text-gray-500">
                Google Map preview (mock)
              </Text>
            </View>
          </View>

          {/* Duration */}
          <Text className="text-base font-semibold mb-2">Duration</Text>
          <View className="flex-row mb-4">
            {DURATIONS.map((duration) => {
              const active = durationId === duration.id;
              return (
                <TouchableOpacity
                  key={duration.id}
                  className={`px-4 py-2 mr-3 rounded-full border ${
                    active ? 'bg-[#1A78F2] border-[#1A78F2]' : 'border-gray-300'
                  }`}
                  onPress={() => setDurationId(duration.id)}
                >
                  <Text
                    className={`font-medium ${
                      active ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Add-ons */}
          <Text className="text-base font-semibold mb-2">Add-ons</Text>
          {ADD_ONS.map((addOn) => {
            const active = selectedAddOns.includes(addOn.id);
            return (
              <TouchableOpacity
                key={addOn.id}
                className={`flex-row justify-between items-center p-3 mb-2 rounded-xl border ${
                  active ? 'border-[#1A78F2] bg-blue-50' : 'border-gray-200'
                }`}
                onPress={() =>
                  toggleItem(selectedAddOns, addOn.id, setSelectedAddOns)
                }
              >
                <Text className="text-gray-800">{addOn.label}</Text>
                <Text className="font-semibold">
                  {addOn.price.toLocaleString()} ₫
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Options */}
          <Text className="text-base font-semibold mt-4 mb-2">Options</Text>
          {OPTIONS.map((option) => {
            const active = selectedOptions.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                className={`flex-row justify-between items-center p-3 mb-2 rounded-xl border ${
                  active ? 'border-[#1A78F2] bg-blue-50' : 'border-gray-200'
                }`}
                onPress={() =>
                  toggleItem(selectedOptions, option.id, setSelectedOptions)
                }
              >
                <Text className="text-gray-800">{option.label}</Text>
                <Text className="font-semibold">
                  {option.price.toLocaleString()} ₫
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Summary */}
          <View className="mt-6 p-4 rounded-2xl bg-gray-50">
            <Text className="text-base font-semibold mb-2">Summary</Text>
            <View className="flex-row justify-between mb-1">
              <Text>Base</Text>
              <Text>{basePrice.toLocaleString()} ₫</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text>Add-ons</Text>
              <Text>{addOnPrice.toLocaleString()} ₫</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text>Options</Text>
              <Text>{optionPrice.toLocaleString()} ₫</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-[#1A78F2]">
                {total.toLocaleString()} ₫
              </Text>
            </View>
          </View>

          {/* Payment */}
          <Text className="text-base font-semibold mt-6 mb-2">
            Payment method
          </Text>
          <View className="flex-row flex-wrap">
            {PAYMENT_METHODS.map((method) => {
              const active = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  className={`px-4 py-2 mr-2 mb-2 rounded-full border ${
                    active ? 'bg-[#1A78F2] border-[#1A78F2]' : 'border-gray-300'
                  }`}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text className={active ? 'text-white' : 'text-gray-700'}>
                    {method}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Sticky confirm button */}
      <View className="px-5 pb-4 pt-2 border-t border-gray-200 bg-white">
        <Button className="rounded-xl" onPress={handleSubmit}>
          Confirm & Pay
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;


