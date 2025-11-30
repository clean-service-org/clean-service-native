import Button from '@/components/Button';
import InputWithLabel from '@/components/Input';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const ADD_ONS = [
  { id: 'cooking', label: 'Cooking', price: 50000 },
  { id: 'ironing', label: 'Ironing', price: 50000 },
];

const OPTIONS = [{ id: 'pet', label: 'House with pet', price: 30000 }];

const DURATIONS = [
  { id: '2h', label: '2 hours', price: 150000 },
  { id: '4h', label: '4 hours', price: 300000 },
];

const PAYMENT_METHODS = ['Cash', 'Momo', 'ZaloPay', 'Credit Card'];

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAP_KEY;

// Mock coordinates cho Hồ Chí Minh City
const DEFAULT_REGION = {
  latitude: 10.762622,
  longitude: 106.660172,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const BookingScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [durationId, setDurationId] = useState<string>('2h');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');

  // Map states
  const mapRef = useRef<MapView>(null);
  const [markerCoords, setMarkerCoords] = useState({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Geocode address to coordinates
  const geocodeAddress = async (addressText: string) => {
    if (!addressText.trim()) return;

    setIsGeocoding(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressText)}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setMarkerCoords({ latitude: location.lat, longitude: location.lng });

        // Animate camera to new location
        mapRef.current?.animateCamera({
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          zoom: 16,
        });
      } else {
        alert('Could not find the address. Please try another address.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error finding address. Please check your internet connection.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setMarkerCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Animate camera to current location
      mapRef.current?.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 16,
      });

      // Reverse geocode to get address
      const reverseUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(reverseUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Error getting your location');
    }
  };

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
          <View className="mb-2">
            <InputWithLabel
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View className="flex-row mb-4 gap-2">
            <TouchableOpacity
              className="flex-1 bg-blue-500 py-2 rounded-lg"
              onPress={() => geocodeAddress(address)}
              disabled={isGeocoding || !address.trim()}
            >
              <Text className="text-white text-center font-medium">
                {isGeocoding ? 'Searching...' : 'Find on Map'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-500 py-2 rounded-lg"
              onPress={getCurrentLocation}
            >
              <Text className="text-white text-center font-medium">
                Use My Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Google Map */}
          <View className="mb-6 rounded-2xl overflow-hidden border border-gray-200">
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{ height: 250 }}
              initialRegion={DEFAULT_REGION}
            >
              <Marker
                coordinate={markerCoords}
                draggable
                onDragEnd={(e) => {
                  const coords = e.nativeEvent.coordinate;
                  setMarkerCoords(coords);
                  // Reverse geocode when marker is dragged
                  fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_API_KEY}`,
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.status === 'OK' && data.results.length > 0) {
                        setAddress(data.results[0].formatted_address);
                      }
                    })
                    .catch((err) =>
                      console.error('Reverse geocode error:', err),
                    );
                }}
                title="Service Location"
                description={address || 'Drag to adjust location'}
              />
            </MapView>
          </View>

          <Text className="text-xs text-gray-500 mb-4 -mt-2">
            💡 Tip: Drag the marker to adjust your exact location
          </Text>

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
