import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Booking, getHelperBookings } from '../../../app/task/api';

const Task = () => {
    const router = useRouter();
    const { userData } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            console.log('Task tab focused, userData:', userData);
            console.log('userId:', userData?.userId);
            if (userData?.userId) {
                loadBookings();
            } else {
                // User is not authenticated, stop loading
                setIsLoading(false);
                setError('Please log in to view your tasks');
            }
        }, [userData?.userId])
    );

    const loadBookings = async () => {
        if (!userData?.userId) {
            setError('Please log in to view your tasks');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            console.log('Fetching bookings for userId:', userData.userId);
            const response = await getHelperBookings(userData.userId);
            console.log('Bookings response:', response);
            setBookings(response.data.results);
        } catch (err: any) {
            console.error('Error loading bookings:', err);
            setError(err.message || 'Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const [filter, setFilter] = useState<'all' | 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled'>(
        'all',
    );

    const mapStatus = (status: string): string => {
        const statusMap: { [key: string]: string } = {
            'Pending': 'pending',
            'Confirmed': 'confirmed',
            'InProgress': 'in_progress',
            'Completed': 'completed',
            'Cancelled': 'cancelled',
        };
        return statusMap[status] || status.toLowerCase();
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
    const inProgressCount = bookings.filter((b) => b.status === 'InProgress').length;
    const completedCount = bookings.filter((b) => b.status === 'Completed').length;

    const formatTime = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const formatHour = (date: Date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        };
        return `${formatHour(startDate)} - ${formatHour(endDate)}`;
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100';
            case 'medium':
                return 'bg-yellow-100';
            case 'low':
                return 'bg-green-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getPriorityTextColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-800';
            case 'medium':
                return 'text-yellow-800';
            case 'low':
                return 'text-green-800';
            default:
                return 'text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Assigned';
            case 'in_progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 pt-5 pb-6">
                <Text className="text-3xl font-bold text-gray-900 mb-1">
                    My Tasks
                </Text>
                <Text className="text-sm text-gray-600">
                    {confirmedCount} assigned • {inProgressCount} in progress • {completedCount} completed
                </Text>
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="text-gray-600 mt-4">Loading bookings...</Text>
                </View>
            ) : error ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Ionicons name="alert-circle" size={48} color="#EF4444" />
                    <Text className="text-red-600 font-semibold text-lg mt-4">Error</Text>
                    <Text className="text-gray-600 text-center mt-2">{error}</Text>
                    <TouchableOpacity
                        onPress={loadBookings}
                        className="mt-4 bg-blue-600 px-6 py-3 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-grow-0 h-fit min-h-14 pb-4 mb-4 px-4 flex gap-2"
                    >
                        <TouchableOpacity
                            onPress={() => setFilter('all')}
                            style={{
                                backgroundColor: filter === 'all' ? '#3B82F6' : '#F3F4F6',
                            }}
                            className="w-fit h-10 px-2 flex justify-center items-center rounded-lg mr-2"
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: filter === 'all' ? '#FFFFFF' : '#6B7280',
                                }}
                            >
                                All ({bookings.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFilter('InProgress')}
                            style={{
                                backgroundColor: filter === 'InProgress' ? '#3B82F6' : '#F3F4F6',
                            }}
                            className="w-fit h-10 px-2 flex justify-center items-center rounded-lg mr-2"
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: filter === 'InProgress' ? '#FFFFFF' : '#6B7280',
                                }}
                            >
                                In Progress ({inProgressCount})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFilter('Confirmed')}
                            style={{
                                backgroundColor: filter === 'Confirmed' ? '#3B82F6' : '#F3F4F6',
                            }}
                            className="w-fit h-10 px-2 flex justify-center items-center rounded-lg mr-2"
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: filter === 'Confirmed' ? '#FFFFFF' : '#6B7280',
                                }}
                            >
                                Confirmed ({confirmedCount})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFilter('Completed')}
                            style={{
                                backgroundColor: filter === 'Completed' ? '#3B82F6' : '#F3F4F6',
                            }}
                            className="w-fit h-10 px-2 flex justify-center items-center rounded-lg"
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: filter === 'Completed' ? '#FFFFFF' : '#6B7280',
                                }}
                            >
                                Completed ({completedCount})
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <FlatList
                        data={filteredBookings}
                        keyExtractor={(item) => item.id}
                        className="px-6"
                        contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => router.push(`/task/${item.id}/info`)}
                                className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm"
                            >
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="flex-1 mr-3">
                                        <Text className="text-lg font-bold text-gray-900 mb-2">
                                            {item.serviceType.name}
                                        </Text>
                                        <View className="flex-row items-center gap-2 mb-2">
                                            <View className={`px-2 py-1 rounded-full ${getStatusColor(mapStatus(item.status))}`}>
                                                <Text className={`text-xs font-semibold ${getStatusColor(mapStatus(item.status))}`}>
                                                    {getStatusLabel(mapStatus(item.status))}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text className="text-xl font-bold text-green-600">
                                        ${item.totalPrice.toFixed(0)}
                                    </Text>
                                </View>

                                <Text className="text-sm text-gray-600 mb-3 leading-5">
                                    {item.serviceType.description || 'No description available'}
                                </Text>

                                <View className="space-y-2 mb-3">
                                    <View className="flex-row items-center">
                                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                                        <Text className="ml-2 text-sm text-gray-700 font-medium">
                                            {formatTime(item.scheduledStartTime, item.scheduledEndTime)}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-start">
                                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                                        <Text className="ml-2 text-sm text-gray-700 font-medium flex-1">
                                            {item.location}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="person-outline" size={16} color="#6B7280" />
                                        <Text className="ml-2 text-sm text-gray-700 font-medium">
                                            {item.customer.fullName}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-end pt-2 border-t border-gray-100">
                                    <Text className="text-sm text-blue-600 font-semibold mr-1">
                                        View Details
                                    </Text>
                                    <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View className="items-center py-10">
                                <Ionicons name="briefcase-outline" size={48} color="#D1D5DB" />
                                <Text className="text-base font-semibold text-gray-600 mt-3">
                                    No bookings found
                                </Text>
                                <Text className="text-sm text-gray-400 mt-1">
                                    Bookings matching this filter will appear here
                                </Text>
                            </View>
                        }
                    />
                </>
            )}
        </SafeAreaView>
    );
};

export default Task;
