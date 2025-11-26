import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

const TASKS: Record<string, Task> = {
  '1': {
    id: '1',
    title: 'Office Cleaning',
    requestedBy: 'John Smith',
    description: 'Deep clean the conference rooms and hallways',
    time: '09:00 AM - 12:00 PM',
    location: '456 Business Ave, Suite 200',
    price: 150,
    priority: 'high',
    accepted: false,
  },
};

const TaskDetailScreen = () => {
  const task = TASKS['1'];

  const router = useRouter();

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

  const handleAccept = () => {
    Alert.alert(
      'Task Accepted',
      `You have accepted "${task.title}" for $${task.price}. You'll receive more details shortly.`,
    );
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#3B82F6',
          paddingTop: 20,
          paddingBottom: 24,
          paddingHorizontal: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#FFFFFF',
            flex: 1,
            marginLeft: 12,
          }}
        >
          Task Details
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
      >
        {/* Task Title and Price */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: 8,
            }}
          >
            {task.title}
          </Text>
          <View style={{ flexDirection: 'column' }}>
            <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: 8,
            }}
          >
            Price
          </Text>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#10B981' }}>
              ${task.price}
            </Text>
          </View>
        </View>

        {/* Requested By */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#F3F4F6',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <MaterialCommunityIcons name="account" size={24} color="#6B7280" />
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
              Requested by
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
              {task.requestedBy}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: 8,
            }}
          >
            Description
          </Text>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 22 }}>
              {task.description}
            </Text>
          </View>
        </View>

        {/* Time and Location */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#3B82F610',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#3B82F6"
                />
              </View>
              <View>
                <Text
                  style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}
                >
                  Scheduled Time
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: '600', color: '#1F2937' }}
                >
                  {task.time}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              paddingTop: 16,
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#3B82F610',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={20}
                  color="#3B82F6"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}
                >
                  Location
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: '600', color: '#1F2937' }}
                >
                  {task.location}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Accept Button */}
      <View
        style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 }}
      >
        <TouchableOpacity
          onPress={handleAccept}
          style={{
            backgroundColor: '#3B82F6',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color="#FFFFFF"
          />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
            Accept Task for ${task.price}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetailScreen;
