import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="service/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="booking/index"
        options={({ navigation }) => ({
          title: 'Booking',
          headerTitleAlign: 'center',
          headerTintColor: 'black',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                paddingVertical: 8,
              }}
              activeOpacity={0.5}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="feedback/index"
        options={{
          title: 'Feedback',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}

