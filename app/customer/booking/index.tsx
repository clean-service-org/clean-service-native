import Button from '@/components/Button';
import InputWithLabel from '@/components/Input';
import { API_ENDPOINTS, apiCall } from '@/config/api';
import { CreateBookingRequest } from '@/types/booking.types';
import { ServiceType } from '@/types/service.types';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAYMENT_METHODS = ['Cash', 'Momo', 'ZaloPay'];

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAP_KEY;

// Hardcoded customer ID as requested
const CUSTOMER_ID = 'user_2np2lwmeO5VzPQTLKeaYgCFPhnF';

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

  // Service data
  const [service, setService] = useState<ServiceType | null>(null);
  const [loadingService, setLoadingService] = useState(true);

  // Form state
  const [address, setAddress] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');

  // Date/Time state
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  // Room counts
  const [bedroomCount, setBedroomCount] = useState(0);
  const [bathroomCount, setBathroomCount] = useState(0);
  const [kitchenCount, setKitchenCount] = useState(0);
  const [livingRoomCount, setLivingRoomCount] = useState(0);
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Loading and map states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [markerCoords, setMarkerCoords] = useState({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Fetch service details
  useEffect(() => {
    if (id) {
      fetchServiceDetail();
    }
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      setLoadingService(true);
      const response = await apiCall(
        API_ENDPOINTS.service.typeById(id as string),
      );
      setService(response.data);

      // Set default duration if available
      if (response.data.durationPrice.length > 0) {
        setSelectedDuration(response.data.durationPrice[0].id);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      Alert.alert('Error', 'Could not load service details');
    } finally {
      setLoadingService(false);
    }
  };

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

  // Calculate pricing
  const selectedDurationData = useMemo(() => {
    return service?.durationPrice.find((d) => d.id === selectedDuration);
  }, [service, selectedDuration]);

  const roomPriceTotal = useMemo(() => {
    if (!service) return 0;
    let total = 0;

    // Calculate bedroom price
    const bedroomPricing = service.roomPricing.filter(
      (r) => r.roomType === 'Bedroom',
    );
    const bedroomPrice = bedroomPricing.find(
      (r) => r.roomCount === bedroomCount,
    );
    if (bedroomPrice) total += bedroomPrice.additionalPrice;

    // Calculate bathroom price
    const bathroomPricing = service.roomPricing.filter(
      (r) => r.roomType === 'Bathroom',
    );
    const bathroomPrice = bathroomPricing.find(
      (r) => r.roomCount === bathroomCount,
    );
    if (bathroomPrice) total += bathroomPrice.additionalPrice;

    // Calculate kitchen price
    const kitchenPricing = service.roomPricing.filter(
      (r) => r.roomType === 'Kitchen',
    );
    const kitchenPrice = kitchenPricing.find(
      (r) => r.roomCount === kitchenCount,
    );
    if (kitchenPrice) total += kitchenPrice.additionalPrice;

    // Calculate living room price
    const livingRoomPricing = service.roomPricing.filter(
      (r) => r.roomType === 'LivingRoom',
    );
    const livingRoomPrice = livingRoomPricing.find(
      (r) => r.roomCount === livingRoomCount,
    );
    if (livingRoomPrice) total += livingRoomPrice.additionalPrice;

    return total;
  }, [service, bedroomCount, bathroomCount, kitchenCount, livingRoomCount]);

  const basePrice = service?.basePrice || 0;
  const durationMultiplier = selectedDurationData?.priceMultiplier || 0;
  // Formula: basePrice + roomPrices + (basePrice * durationMultiplier)
  const total = basePrice + roomPriceTotal + basePrice * durationMultiplier;

  // Calculate end time based on start time + duration
  const endTime = useMemo(() => {
    const durationHours = selectedDurationData?.durationHours || 2;
    const end = new Date(startTime);
    end.setHours(end.getHours() + durationHours);
    return end;
  }, [startTime, selectedDurationData]);

  // Get room count options from service data
  const bedroomOptions = useMemo(() => {
    if (!service) return [];
    return service.roomPricing
      .filter((r) => r.roomType === 'Bedroom')
      .map((r) => r.roomCount)
      .sort((a, b) => a - b);
  }, [service]);

  const bathroomOptions = useMemo(() => {
    if (!service) return [];
    return service.roomPricing
      .filter((r) => r.roomType === 'Bathroom')
      .map((r) => r.roomCount)
      .sort((a, b) => a - b);
  }, [service]);

  const handleSubmit = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Service ID is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time properly
      const scheduledStart = new Date(scheduledDate);
      scheduledStart.setHours(
        startTime.getHours(),
        startTime.getMinutes(),
        0,
        0,
      );

      const scheduledEnd = new Date(scheduledDate);
      scheduledEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

      // Prepare booking data
      const bookingData: CreateBookingRequest = {
        customerId: CUSTOMER_ID,
        serviceTypeId: id as string, // Use service ID from params
        location: address,
        scheduledStartTime: scheduledStart.toISOString(),
        scheduledEndTime: scheduledEnd.toISOString(),
        paymentMethod: paymentMethod.toLowerCase(),
        bookingDetails: {
          durationPriceId: selectedDuration || null,
          bedroomCount,
          bathroomCount,
          kitchenCount,
          livingRoomCount,
          specialRequirements: specialRequirements || null,
        },
        contractContent: `Booking for ${service?.name}. ${address}`,
      };

      console.log('Creating booking:', bookingData);

      // Call API
      const response = await apiCall(API_ENDPOINTS.booking.create, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });

      console.log('Booking created:', response);

      // Check if payment link exists and open it
      if (response?.data?.paymentLink) {
        const paymentLink = response.data.paymentLink;

        Alert.alert('Booking Created!', 'Redirecting to payment...', [
          {
            text: 'OK',
            onPress: async () => {
              try {
                // Try to open in ZaloPay app first, fallback to browser
                const canOpen = await Linking.canOpenURL(paymentLink);
                if (canOpen) {
                  await Linking.openURL(paymentLink);
                } else {
                  // Open in browser if can't open in app
                  await WebBrowser.openBrowserAsync(paymentLink);
                }

                // Navigate to activity after a short delay
                setTimeout(() => {
                  router.replace('/customer/(tabs)/activity');
                }, 1000);
              } catch (error) {
                console.error('Error opening payment link:', error);
                Alert.alert('Error', 'Could not open payment page');
              }
            },
          },
        ]);
      } else {
        // No payment link, just show success
        Alert.alert(
          'Success',
          `Booking created successfully!\nTotal: ${total.toLocaleString()} ₫`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/customer/(tabs)/activity'),
            },
          ],
        );
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert(
        'Error',
        error?.message || 'Failed to create booking. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingService) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1A78F2" />
          <Text className="text-gray-500 mt-3">Loading service details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-gray-600 text-center mb-4">
            Service not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#1A78F2] px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

          {/* Date & Time Selection */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-3">Schedule 📅</Text>

            {/* Date Picker */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 mb-3 bg-gray-50 rounded-xl border border-gray-200"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-gray-600">Date</Text>
              <Text className="font-semibold text-gray-800">
                {scheduledDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            {/* Start Time Picker */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text className="text-gray-600">Start Time</Text>
              <Text className="font-semibold text-gray-800">
                {startTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>

            <Text className="text-xs text-gray-500 mt-2 ml-1">
              {selectedDurationData &&
                `Duration: ${selectedDurationData.durationHours}h`}
              {selectedDurationData && ' • '}
              End time:{' '}
              {endTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          {/* Room Details - Dynamic based on service */}
          {service &&
            (bedroomOptions.length > 0 || bathroomOptions.length > 0) && (
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3">
                  Room Selection 🏠
                </Text>

                {/* Bedroom Selection */}
                {bedroomOptions.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">Bedrooms</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {bedroomOptions.map((count) => {
                        const pricing = service.roomPricing.find(
                          (r) =>
                            r.roomType === 'Bedroom' && r.roomCount === count,
                        );
                        const active = bedroomCount === count;
                        return (
                          <TouchableOpacity
                            key={count}
                            className={`px-4 py-3 rounded-xl border flex-1 min-w-[30%] ${
                              active
                                ? 'bg-[#1A78F2] border-[#1A78F2]'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                            onPress={() => setBedroomCount(count)}
                          >
                            <Text
                              className={`text-center font-semibold ${
                                active ? 'text-white' : 'text-gray-700'
                              }`}
                            >
                              {count} {count > 1 ? 'rooms' : 'room'}
                            </Text>
                            {pricing && (
                              <Text
                                className={`text-center text-xs mt-1 ${
                                  active ? 'text-white' : 'text-[#1A78F2]'
                                }`}
                              >
                                +{pricing.additionalPrice.toLocaleString()}₫
                              </Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Bathroom Selection */}
                {bathroomOptions.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">
                      Bathrooms
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {bathroomOptions.map((count) => {
                        const pricing = service.roomPricing.find(
                          (r) =>
                            r.roomType === 'Bathroom' && r.roomCount === count,
                        );
                        const active = bathroomCount === count;
                        return (
                          <TouchableOpacity
                            key={count}
                            className={`px-4 py-3 rounded-xl border flex-1 min-w-[30%] ${
                              active
                                ? 'bg-[#1A78F2] border-[#1A78F2]'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                            onPress={() => setBathroomCount(count)}
                          >
                            <Text
                              className={`text-center font-semibold ${
                                active ? 'text-white' : 'text-gray-700'
                              }`}
                            >
                              {count} {count > 1 ? 'rooms' : 'room'}
                            </Text>
                            {pricing && (
                              <Text
                                className={`text-center text-xs mt-1 ${
                                  active ? 'text-white' : 'text-[#1A78F2]'
                                }`}
                              >
                                +{pricing.additionalPrice.toLocaleString()}₫
                              </Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

          {/* Special Requirements */}
          <View className="mb-6">
            <Text className="text-base font-semibold mb-2">
              Special Requirements
            </Text>
            <InputWithLabel
              placeholder="Any special requirements or notes..."
              value={specialRequirements}
              onChangeText={setSpecialRequirements}
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: 'top' }}
            />
          </View>

          {/* Duration - Dynamic based on service */}
          {service && service.durationPrice.length > 0 && (
            <View className="mb-6">
              <Text className="text-base font-semibold mb-2">Duration ⏰</Text>
              <View className="flex-row flex-wrap gap-2">
                {service.durationPrice.map((duration) => {
                  const active = selectedDuration === duration.id;
                  return (
                    <TouchableOpacity
                      key={duration.id}
                      className={`px-4 py-3 rounded-xl border flex-1 min-w-[30%] ${
                        active
                          ? 'bg-[#1A78F2] border-[#1A78F2]'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      onPress={() => setSelectedDuration(duration.id)}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          active ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {duration.durationHours}h
                      </Text>
                      <Text
                        className={`text-center text-xs mt-1 ${
                          active ? 'text-white' : 'text-[#1A78F2]'
                        }`}
                      >
                        ×{duration.priceMultiplier}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Summary */}
          <View className="mt-6 p-4 rounded-2xl bg-gray-50">
            <Text className="text-base font-semibold mb-2">Summary</Text>
            <View className="flex-row justify-between mb-1">
              <Text>Base Price</Text>
              <Text>{basePrice.toLocaleString()} ₫</Text>
            </View>
            {selectedDurationData && (
              <View className="flex-row justify-between mb-1">
                <Text>Duration ({selectedDurationData.durationHours}h)</Text>
                <Text>×{selectedDurationData.priceMultiplier}</Text>
              </View>
            )}
            {roomPriceTotal > 0 && (
              <View className="flex-row justify-between mb-1">
                <Text>Room pricing</Text>
                <Text>+{roomPriceTotal.toLocaleString()} ₫</Text>
              </View>
            )}
            <View className="border-t border-gray-300 my-2" />
            <View className="flex-row justify-between">
              <Text className="font-bold text-lg">Total</Text>
              <Text className="font-bold text-lg text-[#1A78F2]">
                {total.toLocaleString()} ₫
              </Text>
            </View>
          </View>

          {/* Payment */}
          <Text className="text-base font-semibold mt-6 mb-2">
            Payment method 💳
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

      {/* Date Picker Modal */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <View
              className="bg-white rounded-t-3xl"
              style={{ paddingBottom: 40 }}
            >
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="text-[#1A78F2] text-base">Cancel</Text>
                </TouchableOpacity>
                <Text className="font-semibold text-base">Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="text-[#1A78F2] text-base font-semibold">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 260 }}>
                <DateTimePicker
                  value={scheduledDate}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setScheduledDate(selectedDate);
                  }}
                  minimumDate={new Date()}
                  textColor="#000000"
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setScheduledDate(selectedDate);
            }}
            minimumDate={new Date()}
          />
        )
      )}

      {/* Start Time Picker Modal */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showStartTimePicker}
          transparent={true}
          animationType="slide"
        >
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <View
              className="bg-white rounded-t-3xl"
              style={{ paddingBottom: 40 }}
            >
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                  <Text className="text-[#1A78F2] text-base">Cancel</Text>
                </TouchableOpacity>
                <Text className="font-semibold text-base">
                  Select Start Time
                </Text>
                <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                  <Text className="text-[#1A78F2] text-base font-semibold">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 260 }}>
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="spinner"
                  onChange={(event, selectedTime) => {
                    if (selectedTime) setStartTime(selectedTime);
                  }}
                  textColor="#000000"
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )
      )}

      {/* Sticky confirm button */}
      <View className="px-5 pb-4 pt-2 border-t border-gray-200 bg-white">
        <Button
          className="rounded-xl"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="#fff" className="mr-2" />
              <Text className="text-white font-semibold">Processing...</Text>
            </View>
          ) : (
            `Confirm & Pay ${total.toLocaleString()} ₫`
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;
