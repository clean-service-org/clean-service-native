import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Task {
  id: string;
  title: string;
  requestedBy: string;
  description: string;
  time: string;
  location: string;
  price: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed';
}

const HomeScreen = () => {

  const router = useRouter();

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Office Cleaning',
      requestedBy: 'John Smith',
      description: 'Deep clean the conference rooms and hallways',
      time: '09:00 AM - 12:00 PM',
      location: '456 Business Ave, Suite 200',
      price: 250,
      priority: 'high',
      status: 'confirmed',
    },
    {
      id: '2',
      title: 'Delivery Task',
      requestedBy: 'Sarah Johnson',
      description: 'Pick up and deliver packages to downtown location',
      time: '01:00 PM - 03:00 PM',
      location: '123 Main Street, Downtown',
      price: 175,
      priority: 'medium',
      status: 'confirmed',
    },
    {
      id: '3',
      title: 'Garden Maintenance',
      requestedBy: 'Mike Williams',
      description: 'Mow lawn and trim hedges at residential property',
      time: '10:00 AM - 02:00 PM',
      location: '789 Oak Drive, Residential Area',
      price: 120,
      priority: 'medium',
      status: 'in_progress',
    },
    {
      id: '4',
      title: 'Event Setup',
      requestedBy: 'Lisa Chen',
      description: 'Set up chairs, tables, and decorations for corporate event',
      time: '08:00 AM - 11:00 AM',
      location: '321 Convention Center Way',
      price: 200,
      priority: 'high',
      status: 'confirmed',
    },
    {
      id: '5',
      title: 'Handyman Services',
      requestedBy: 'Robert Taylor',
      description: 'Fix leaky faucet and install shelving units',
      time: '02:00 PM - 05:00 PM',
      location: '555 Maple Street, Apt 4B',
      price: 95,
      priority: 'low',
      status: 'completed',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'confirmed' | 'in_progress' | 'completed'>(
    'all',
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const confirmedCount = tasks.filter((t) => t.status === 'confirmed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

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
            All ({tasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('in_progress')}
          style={{
            backgroundColor: filter === 'in_progress' ? '#3B82F6' : '#F3F4F6',
          }}
          className="w-fit h-10 px-2 flex justify-center items-center rounded-lg mr-2"
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: filter === 'in_progress' ? '#FFFFFF' : '#6B7280',
            }}
          >
            In Progress ({inProgressCount})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setFilter('confirmed')}
          style={{
            backgroundColor: filter === 'confirmed' ? '#3B82F6' : '#F3F4F6',
          }}
          className="w-fit h-10 px-2 flex justify-center items-center rounded-lg mr-2"
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: filter === 'confirmed' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Confirmed ({confirmedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('completed')}
          style={{
            backgroundColor: filter === 'completed' ? '#3B82F6' : '#F3F4F6',
          }}
          className="w-fit h-10 px-2 flex justify-center items-center rounded-lg"
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: filter === 'completed' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Completed ({completedCount})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={filteredTasks}
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
                  {item.title}
                </Text>
                <View className="flex-row items-center gap-2 mb-2">
                  <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    <Text className={`text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-xl font-bold text-green-600">
                ${item.price}
              </Text>
            </View>

            <Text className="text-sm text-gray-600 mb-3 leading-5">
              {item.description}
            </Text>

            <View className="space-y-2 mb-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-700 font-medium">
                  {item.time}
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
                  {item.requestedBy}
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
              No tasks found
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
              Tasks matching this filter will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
