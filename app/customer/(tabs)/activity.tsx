import Logo from '@/assets/images/Logo.svg';
import { API_ENDPOINTS, apiCall } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import type {
  SchedulerBooking,
  SchedulerResponse,
} from '@/types/booking.types';
import type { CustomerFeedback } from '@/types/feedback.types';
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
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// Star icon component
const StarIcon = ({ filled }: { filled: boolean }) => (
  <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={filled ? '#1A78F2' : 'transparent'}
      stroke="#1A78F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Activity = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState<SchedulerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SchedulerBooking | null>(null);
  const [feedbacksMap, setFeedbacksMap] = useState<
    Map<string, CustomerFeedback>
  >(new Map());

  // Feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState<'create' | 'view'>('create');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const feedbackSheetRef = useRef<BottomSheet>(null);
  const isFetchingRef = useRef(false);
  const snapPoints = useMemo(() => ['45%'], []);
  const feedbackSnapPoints = useMemo(() => ['90%'], []);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userData?.userId || isFetchingRef.current) {
        setLoading(false);
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        // Fetch bookings and feedbacks in parallel
        const [bookingsResponse, feedbacksResponse] = await Promise.all([
          apiCall<{
            statusCode: number | string;
            message: string;
            data: SchedulerResponse;
          }>(API_ENDPOINTS.scheduler.byCustomerId(userData.userId)),
          apiCall<{
            statusCode: string;
            message: string;
            data: {
              totalItems: number;
              results: CustomerFeedback[];
            };
          }>(API_ENDPOINTS.feedback.byCustomerId(userData.userId)).catch(
            () => null,
          ),
        ]);

        if (
          (bookingsResponse.statusCode === 200 ||
            bookingsResponse.statusCode === 'OK') &&
          bookingsResponse.data
        ) {
          setBookings(bookingsResponse.data.results);
        }

        // Map feedbacks by bookingId
        if (feedbacksResponse?.data?.results) {
          const feedbackMap = new Map<string, CustomerFeedback>();
          feedbacksResponse.data.results.forEach((feedback) => {
            feedbackMap.set(feedback.bookingId, feedback);
          });
          setFeedbacksMap(feedbackMap);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
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

  // Open feedback modal
  const openFeedbackModal = useCallback(() => {
    if (!selected) return;

    // Close details sheet first
    closeBottomSheet();

    // Check if feedback exists for this booking
    const existingFeedback = feedbacksMap.get(selected.id);

    if (existingFeedback) {
      // View mode - show existing feedback
      setFeedbackMode('view');
      setFeedbackTitle(existingFeedback.title);
      setFeedbackDescription(existingFeedback.description);
      setFeedbackRating(existingFeedback.rating || selected.helperRating || 0);
    } else {
      // Create mode - reset form
      setFeedbackMode('create');
      setFeedbackTitle('');
      setFeedbackDescription('');
      setFeedbackRating(0);
    }

    // Open feedback sheet after a short delay
    setTimeout(() => {
      feedbackSheetRef.current?.expand();
      setShowFeedbackModal(true);
    }, 300);
  }, [selected, closeBottomSheet, feedbacksMap]);

  const closeFeedbackModal = useCallback(() => {
    feedbackSheetRef.current?.close();
    setShowFeedbackModal(false);
    setFeedbackTitle('');
    setFeedbackDescription('');
    setFeedbackRating(0);
  }, []);

  // Submit feedback
  const submitFeedback = async () => {
    if (!selected) return;

    // Validation
    if (feedbackRating === 0) {
      Alert.alert('Validation Error', 'Please select a rating');
      return;
    }

    if (!feedbackTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a title');
      return;
    }

    if (!feedbackDescription.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return;
    }

    try {
      setSubmittingFeedback(true);

      const response = await apiCall(API_ENDPOINTS.feedback.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selected.id,
          title: feedbackTitle.trim(),
          description: feedbackDescription.trim(),
          rating: feedbackRating,
        }),
      });

      console.log('Feedback response:', response);

      Alert.alert('Success', 'Your feedback has been submitted successfully!', [
        {
          text: 'OK',
          onPress: async () => {
            closeFeedbackModal();
            // Refresh feedbacks only
            if (userData?.userId) {
              try {
                const feedbacksResponse = await apiCall<{
                  statusCode: string;
                  message: string;
                  data: {
                    totalItems: number;
                    results: CustomerFeedback[];
                  };
                }>(API_ENDPOINTS.feedback.byCustomerId(userData.userId));

                if (feedbacksResponse?.data?.results) {
                  const feedbackMap = new Map<string, CustomerFeedback>();
                  feedbacksResponse.data.results.forEach((feedback) => {
                    feedbackMap.set(feedback.bookingId, feedback);
                  });
                  setFeedbacksMap(feedbackMap);
                }
              } catch (err) {
                console.error('Error refreshing feedbacks:', err);
              }
            }
          },
        },
      ]);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      Alert.alert(
        'Error',
        err.message || 'Failed to submit feedback. Please try again.',
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

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

              {/* Feedback button for completed bookings */}
              {selected.status.toLowerCase() === 'completed' && (
                <TouchableOpacity
                  onPress={openFeedbackModal}
                  className="mt-4 bg-[#1A78F2] rounded-xl py-3 px-4 items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-base">
                    {feedbacksMap.has(selected.id)
                      ? 'View Feedback'
                      : 'Leave Feedback'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* Feedback Bottom Sheet */}
      <BottomSheet
        ref={feedbackSheetRef}
        snapPoints={feedbackSnapPoints}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={backDrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onChange={(index) => {
          if (index === -1) {
            setShowFeedbackModal(false);
          }
        }}
      >
        <BottomSheetView className="flex-1 px-5 pt-3 pb-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            keyboardVerticalOffset={10}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text className="text-xl font-bold text-[#1A78F2] mb-1">
                {feedbackMode === 'view' ? 'Your Feedback' : 'Leave Feedback'}
              </Text>
              <Text className="text-gray-500 text-sm mb-4">
                {feedbackMode === 'view'
                  ? 'You already submitted feedback for this service'
                  : 'Share your experience with this service'}
              </Text>

              {/* Rating */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Rating <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() =>
                        feedbackMode === 'create' && setFeedbackRating(star)
                      }
                      activeOpacity={feedbackMode === 'create' ? 0.7 : 1}
                      disabled={feedbackMode === 'view'}
                    >
                      <StarIcon filled={star <= feedbackRating} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Title */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Title <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={feedbackTitle}
                  onChangeText={setFeedbackTitle}
                  placeholder="e.g., Great service!"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
                  maxLength={100}
                  editable={feedbackMode === 'create'}
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Description <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={feedbackDescription}
                  onChangeText={setFeedbackDescription}
                  placeholder="Tell us about your experience..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 min-h-[100px]"
                  maxLength={500}
                  editable={feedbackMode === 'create'}
                />
                <Text className="text-gray-400 text-xs mt-1">
                  {feedbackDescription.length}/500
                </Text>
              </View>

              {/* Submit Button - only show in create mode */}
              {feedbackMode === 'create' && (
                <TouchableOpacity
                  onPress={submitFeedback}
                  disabled={submittingFeedback}
                  className={`rounded-xl py-3 px-4 items-center ${
                    submittingFeedback ? 'bg-gray-400' : 'bg-[#1A78F2]'
                  }`}
                  activeOpacity={0.8}
                >
                  {submittingFeedback ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Submit Feedback
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {/* Close Button */}
              <TouchableOpacity
                onPress={closeFeedbackModal}
                disabled={submittingFeedback && feedbackMode === 'create'}
                className={`${feedbackMode === 'create' ? 'mt-3' : ''} py-3 px-4 items-center`}
                activeOpacity={0.8}
              >
                <Text className="text-gray-500 font-medium">
                  {feedbackMode === 'view' ? 'Close' : 'Cancel'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Activity;
