import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
  accepted: boolean;
}

const HomeScreen = () => {

  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Office Cleaning',
      requestedBy: 'John Smith',
      description: 'Deep clean the conference rooms and hallways',
      time: '09:00 AM - 12:00 PM',
      location: '456 Business Ave, Suite 200',
      price: 250,
      priority: 'high',
      accepted: true,
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
      accepted: true,
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
      accepted: true,
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
      accepted: true,
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
      accepted: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'available' | 'accepted'>(
    'available',
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'available') return !task.accepted;
    if (filter === 'accepted') return task.accepted;
    return true;
  });

  const acceptedCount = tasks.filter((t) => t.accepted).length;
  const availableCount = tasks.filter((t) => !t.accepted).length;

  const handleAcceptTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, accepted: !task.accepted } : task,
      ),
    );
    const task = tasks.find((t) => t.id === id);
    if (task && !task.accepted) {
      Alert.alert(
        'Task Accepted',
        `You accepted "${task.title}" for $${task.price}`,
      );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View
        style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: 4,
          }}
        >
          Available Tasks
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          {availableCount} tasks available • {acceptedCount} accepted
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-grow-0 w-full h-fit min-h-14 pb-4 mb-4 px-4 flex gap-2"
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
          onPress={() => setFilter('available')}
          style={{
            backgroundColor: filter === 'available' ? '#3B82F6' : '#F3F4F6',
          }}
          className="w-fit h-10 px-2 flex justify-center items-center rounded-lg mr-2"
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: filter === 'available' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Available ({availableCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('accepted')}
          style={{
            backgroundColor: filter === 'accepted' ? '#3B82F6' : '#F3F4F6',
          }}
          className="w-fit h-10 px-2 flex justify-center items-center rounded-lg"
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: filter === 'accepted' ? '#FFFFFF' : '#6B7280',
            }}
          >
            My Tasks ({acceptedCount})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={[
          { paddingHorizontal: 24, paddingBottom: 100 },
          { flexDirection: 'column', justifyContent: 'flex-start' },
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push("/employee/home/task-detail")
            }
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: item.accepted
                ? '#10B981'
                : getPriorityColor(item.priority),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#1F2937',
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </Text>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={14}
                    color="#6B7280"
                  />
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>
                    {item.requestedBy}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#10B981',
                    marginBottom: 4,
                  }}
                >
                  ${item.price}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: '#6B7280',
                marginBottom: 12,
                lineHeight: 18,
              }}
            >
              {item.description}
            </Text>

            <View style={{ gap: 8, marginBottom: 12 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color="#3B82F6"
                />
                <Text
                  style={{ fontSize: 13, color: '#1F2937', fontWeight: '500' }}
                >
                  {item.time}
                </Text>
              </View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={16}
                  color="#3B82F6"
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: '#1F2937',
                    fontWeight: '500',
                    flex: 1,
                  }}
                >
                  {item.location}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleAcceptTask(item.id)}
              style={{
                backgroundColor: item.accepted ? '#F3F4F6' : '#3B82F6',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <MaterialCommunityIcons
                name={item.accepted ? 'check-circle' : 'plus-circle-outline'}
                size={18}
                color={item.accepted ? '#9CA3AF' : '#FFFFFF'}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: item.accepted ? '#9CA3AF' : '#FFFFFF',
                }}
              >
                {item.accepted ? 'Accepted' : 'Accept Task'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={48}
              color="#D1D5DB"
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#6B7280',
                marginTop: 12,
              }}
            >
              No tasks available
            </Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>
              Check back later for more opportunities
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
