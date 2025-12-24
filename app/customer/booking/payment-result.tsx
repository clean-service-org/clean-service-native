import Button from '@/components/Button';

import { useLocalSearchParams, useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';

import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { API_ENDPOINTS, apiCall } from '@/config/api';

import { useAuth } from '@/contexts/AuthContext';

export default function PaymentResultScreen() {
  const router = useRouter();

  const { userData } = useAuth();

  const { status, apptransid } = useLocalSearchParams<{
    status: string;

    apptransid: string;
  }>();

  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    // Cancel booking if status is 2 (failed) and apptransid exists

    if (status !== '1' && status !== '3' && apptransid) {
      cancelBooking();
    }
  }, [status, apptransid]);

  const cancelBooking = async () => {
    try {
      if (!userData?.accessToken) {
        return;
      }
      
      setIsCancelling(true);

      // Extract orderId from apptransid (format: prefix_orderId_timestamp)

      const orderId = parseInt(apptransid.split('_')[1]);
      
      console.log('Cancelling booking with orderId:', orderId);

      if (!isNaN(orderId)) {
        await apiCall(`${API_ENDPOINTS.payment.cancelPayment}/${orderId}`, {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });

        console.log('Booking cancelled successfully');
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleGoToHome = () => {
    router.push('/customer/(tabs)');
  };

  const handleViewBooking = () => {
    router.push('/customer/(tabs)/activity');
  };

  const handleTryAgain = () => {
    router.push('/customer/(tabs)');
  };

  // Status: 1 = Success, 2 = Failed, 3 = Processing

  const renderContent = () => {
    switch (status) {
      case '1':
        // Success

        return (
          <>
            {/* Success Icon */}

            <View className="w-24 h-24 rounded-full bg-green-100 justify-center items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-green-500 justify-center items-center">
                <Text className="text-white text-4xl font-bold">✓</Text>
              </View>
            </View>

            {/* Success Message */}

            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Payment Successful!
            </Text>

            <Text className="text-base text-gray-600 text-center mb-8 px-4">
              Your booking has been confirmed. We'll send you a notification
              when an employee is assigned to your service.
            </Text>

            {/* Booking Details Card */}

            <View className="w-full bg-gray-50 rounded-lg p-4 mb-8">
              <Text className="text-sm text-gray-500 mb-2">
                Transaction Details
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-700">Status</Text>

                <Text className="text-green-600 font-semibold">Completed</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-700">Payment Method</Text>

                <Text className="text-gray-900 font-medium">
                  Online Payment
                </Text>
              </View>
            </View>

            {/* Action Buttons */}

            <View className="w-full space-y-3">
              <Button onPress={handleViewBooking} className="w-full">
                View My Bookings
              </Button>

              <TouchableOpacity
                onPress={handleGoToHome}
                className="w-full py-4 border border-[#1A78F2] rounded-lg"
              >
                <Text className="text-center text-[#1A78F2] font-semibold">
                  Back to Home
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case '2':
        // Failed

        return (
          <>
            {/* Fail Icon */}

            <View className="w-24 h-24 rounded-full bg-red-100 justify-center items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-red-500 justify-center items-center">
                <Text className="text-white text-4xl font-bold">✕</Text>
              </View>
            </View>

            {/* Fail Message */}

            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Payment Failed
            </Text>

            <Text className="text-base text-gray-600 text-center mb-8 px-4">
              We couldn't process your payment. Please check your payment method
              and try again.
            </Text>

            {/* Error Details Card */}

            <View className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <Text className="text-sm text-gray-500 mb-2">
                Transaction Details
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-700">Status</Text>

                <Text className="text-red-600 font-semibold">Failed</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-700">Reason</Text>

                <Text className="text-gray-900 font-medium">
                  Payment Declined
                </Text>
              </View>
            </View>

            {/* Common Issues */}

            <View className="w-full bg-blue-50 rounded-lg p-4 mb-8">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Common Issues:
              </Text>

              <Text className="text-sm text-gray-700 mb-1">
                • Insufficient funds
              </Text>

              <Text className="text-sm text-gray-700 mb-1">
                • Incorrect card details
              </Text>

              <Text className="text-sm text-gray-700 mb-1">
                • Network connection issues
              </Text>

              <Text className="text-sm text-gray-700">
                • Card expired or blocked
              </Text>
            </View>

            {/* Action Buttons */}

            <View className="w-full space-y-3">
              <Button onPress={handleTryAgain} className="w-full">
                Try Again
              </Button>

              <TouchableOpacity
                onPress={handleGoToHome}
                className="w-full py-4"
              >
                <Text className="text-center text-gray-600 font-medium">
                  Back to Home
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case '3':
        // Processing

        return (
          <>
            {/* Processing Icon */}

            <View className="w-24 h-24 rounded-full bg-blue-100 justify-center items-center mb-6">
              <ActivityIndicator size="large" color="#1A78F2" />
            </View>

            {/* Processing Message */}

            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Processing Payment
            </Text>

            <Text className="text-base text-gray-600 text-center mb-8 px-4">
              Your payment is being processed. This may take a few moments.
              Please do not close this page.
            </Text>

            {/* Processing Details Card */}

            <View className="w-full bg-gray-50 rounded-lg p-4 mb-8">
              <Text className="text-sm text-gray-500 mb-2">
                Transaction Details
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-700">Status</Text>

                <Text className="text-blue-600 font-semibold">
                  Processing...
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-700">Payment Method</Text>

                <Text className="text-gray-900 font-medium">
                  Online Payment
                </Text>
              </View>
            </View>

            {/* Info Box */}

            <View className="w-full bg-blue-50 rounded-lg p-4 mb-8">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Please wait while we confirm your payment
              </Text>

              <Text className="text-sm text-gray-700">
                You will be redirected automatically once the payment is
                confirmed. If this takes longer than expected, please contact
                support.
              </Text>
            </View>

            {/* Action Button */}

          </>
        );

      default:
        // Invalid status

        return (
          <>
            {/* Fail Icon */}

            <View className="w-24 h-24 rounded-full bg-red-100 justify-center items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-red-500 justify-center items-center">
                <Text className="text-white text-4xl font-bold">✕</Text>
              </View>
            </View>

            {/* Fail Message */}

            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Payment Failed
            </Text>

            <Text className="text-base text-gray-600 text-center mb-8 px-4">
              We couldn't process your payment. Please check your payment method
              and try again.
            </Text>

            {/* Error Details Card */}

            <View className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <Text className="text-sm text-gray-500 mb-2">
                Transaction Details
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-700">Status</Text>

                <Text className="text-red-600 font-semibold">Failed</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-700">Reason</Text>

                <Text className="text-gray-900 font-medium">
                  Payment Declined
                </Text>
              </View>
            </View>

            {/* Common Issues */}

            <View className="w-full bg-blue-50 rounded-lg p-4 mb-8">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Common Issues:
              </Text>

              <Text className="text-sm text-gray-700 mb-1">
                • Insufficient funds
              </Text>

              <Text className="text-sm text-gray-700 mb-1">
                • Incorrect card details
              </Text>

              <Text className="text-sm text-gray-700 mb-1">
                • Network connection issues
              </Text>

              <Text className="text-sm text-gray-700">
                • Card expired or blocked
              </Text>
            </View>

            {/* Action Buttons */}

            <View className="w-full space-y-3">
              <Button onPress={handleTryAgain} className="w-full">
                Try Again
              </Button>

              <TouchableOpacity
                onPress={handleGoToHome}
                className="w-full py-4"
              >
                <Text className="text-center text-gray-600 font-medium">
                  Back to Home
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

