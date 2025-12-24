import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import { Booking, completeTask, getBookingById, startTask } from '../../api';

// Safe dynamic import for react-native-maps
let MapView: any = View;
let Marker: any = View;
let Polyline: any = View;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  try {
    // Use dynamic require to prevent Metro from bundling on web
    const moduleName = 'react-native-maps';
    const Maps = require(moduleName);
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (error) {
    console.log('Maps not available:', error);
  }
}

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAP_KEY;

export default function TaskStartScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [task, setTask] = useState<Booking | null>(null);
  const [isTaskLoading, setIsTaskLoading] = useState(true);
  // Map states
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);


  const fetchTaskDetails = async () => {
    try {
      setIsTaskLoading(true);
      const response = await getBookingById(id);
      if (response && response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      Alert.alert('Error', 'Failed to load task details');
    } finally {
      setIsTaskLoading(false);
    }
  };

  // Get current location and fetch directions
  useEffect(() => {
    getCurrentLocationAndDirections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentLocationAndDirections = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'Location permission is required to show directions',
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(currentCoords);

      // Mock destination coordinates if task doesn't have specific coords
      const destinationCoords = {
        latitude: 10.772622,
        longitude: 106.670172,
      };

      // Fetch directions
      await getDirections(currentCoords, destinationCoords);

      // Fit map to show both markers
      if (mapRef.current) {
        mapRef.current.fitToCoordinates([currentCoords, destinationCoords], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      console.error('Error getting location:', err);
    }
  };

  const getDirections = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
  ) => {
    try {
      setIsLoadingRoute(true);
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const points = decodePolyline(route.overview_polyline.points);
        setRouteCoordinates(points);

        // Set distance and duration
        const leg = route.legs[0];
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Decode polyline from Google Directions API
  const decodePolyline = (encoded: string) => {
    const points: { latitude: number; longitude: number }[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  const openInGoogleMaps = () => {
    // Default destination
    const destinationCoords = {
      latitude: 10.772622,
      longitude: 106.670172,
    };

    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation?.latitude},${currentLocation?.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}`;
    Linking.openURL(url);
  };



  const handleStart = async () => {
    try {
      setIsLoading(true);
      await startTask(id);
      // Update local task status to refresh UI
      setTask(prev => prev ? ({ ...prev, status: 'InProgress' }) : null);
    } catch (err: any) {
      console.error('Start task error:', err);
      Alert.alert('Error', err.message || 'Failed to start task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    Alert.alert(
      'Finish Task',
      'Are you sure you want to finish this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            try {
              setIsLoading(true);
              await completeTask(id);
              router.push(`/task/${id}/success` as any);
            } catch (error: any) {
              console.error('Complete task error:', error);
              Alert.alert('Error', error.message || 'Failed to complete task');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Destination coords for map
  const destinationCoords = {
    latitude: 10.772622,
    longitude: 106.670172,
  };

  if (isTaskLoading || !task) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1A78F2" />
        <Text className="text-gray-600 mt-4">Loading task details...</Text>
      </SafeAreaView>
    );
  }

  const isInProgress = task.status === 'InProgress' || task.status === 'in_progress';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Task Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {task.serviceType?.name || 'Task Details'}
        </Text>

        {/* Map Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="map" size={24} color="#1A78F2" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">
                Directions
              </Text>
            </View>
            {currentLocation && (
              <TouchableOpacity
                onPress={openInGoogleMaps}
                className="flex-row items-center bg-blue-500 px-3 py-1.5 rounded-lg"
              >
                <Ionicons name="navigate" size={16} color="white" />
                <Text className="text-white font-medium ml-1 text-sm">
                  Navigate
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Map View */}
          <View className="rounded-2xl overflow-hidden border border-gray-200">
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{ height: 250 }}
              initialRegion={{
                latitude: destinationCoords.latitude,
                longitude: destinationCoords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              {/* Current Location Marker */}
              {currentLocation && (
                <Marker
                  coordinate={currentLocation}
                  title="Your Location"
                  pinColor="blue"
                >
                  <View className="items-center">
                    <View className="bg-blue-500 rounded-full p-2">
                      <Ionicons name="location" size={20} color="white" />
                    </View>
                  </View>
                </Marker>
              )}

              {/* Destination Marker */}
              <Marker
                coordinate={destinationCoords}
                title="Task Location"
                description={task.location}
                pinColor="red"
              />

              {/* Route Polyline */}
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeWidth={4}
                  strokeColor="#1A78F2"
                />
              )}
            </MapView>
          </View>

          {/* Distance and Duration Info */}
          {(distance || duration) && (
            <View className="flex-row justify-around bg-blue-50 p-3 rounded-lg mt-3">
              {distance && (
                <View className="flex-row items-center">
                  <Ionicons name="navigate-circle" size={20} color="#1A78F2" />
                  <View className="ml-2">
                    <Text className="text-xs text-gray-600">Distance</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                      {distance}
                    </Text>
                  </View>
                </View>
              )}
              {duration && (
                <View className="flex-row items-center">
                  <Ionicons name="time" size={20} color="#1A78F2" />
                  <View className="ml-2">
                    <Text className="text-xs text-gray-600">Duration</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                      {duration}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {isLoadingRoute && (
            <View className="flex-row items-center justify-center mt-2">
              <ActivityIndicator size="small" color="#1A78F2" />
              <Text className="text-gray-600 ml-2 text-sm">
                Loading route...
              </Text>
            </View>
          )}
        </View>

        {/* Instructions Section - Only show if not in progress or if needed */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={24} color="#1A78F2" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Before You Start
            </Text>
          </View>
          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-blue-900 leading-6">
              Please review the task details and ensure you have all necessary
              materials before starting.
            </Text>
          </View>
        </View>

        {/* Task Details */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Task Details
          </Text>

          {/* Location */}
          {task.location && (
            <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-lg">
              <Ionicons name="location" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-sm font-medium mb-1">
                  Location
                </Text>
                <Text className="text-gray-900">{task.location}</Text>
              </View>
            </View>
          )}

          {/* Description */}
          {task.serviceType?.description && (
            <View className="bg-gray-50 p-3 rounded-lg mb-3">
              <Text className="text-gray-600 text-sm font-medium mb-1">
                Description
              </Text>
              <Text className="text-gray-900 leading-6">{task.serviceType.description}</Text>
            </View>
          )}
        </View>

        {/* Safety Guidelines */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Safety Guidelines
            </Text>
          </View>
          <View className="bg-green-50 p-4 rounded-lg">
            <View className="flex-row items-start mb-2">
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text className="text-green-900 ml-2 flex-1">
                Wear appropriate protective equipment
              </Text>
            </View>
            <View className="flex-row items-start mb-2">
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text className="text-green-900 ml-2 flex-1">
                Follow proper handling instructions for cleaning materials
              </Text>
            </View>
            <View className="flex-row items-start">
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text className="text-green-900 ml-2 flex-1">
                Report any safety concerns immediately
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View className="px-6 py-4 border-t border-gray-200">
        {!isInProgress ? (
          <Button
            onPress={handleStart}
            disabled={isLoading}
            className="bg-green-600"
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" className="mr-2" />
                <Text className="text-white font-bold">Starting...</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="play-circle" size={20} color="white" />
                <Text className="text-white font-bold ml-2">Start Task</Text>
              </View>
            )}
          </Button>
        ) : (
          <Button
            onPress={handleFinish}
            disabled={isLoading}
            className="bg-[#1A78F2]" // Blue color for finish
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" className="mr-2" />
                <Text className="text-white font-bold">Finishing...</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text className="text-white font-bold ml-2">Finish Task</Text>
              </View>
            )}
          </Button>
        )}

      </View>
    </SafeAreaView>
  );
}
