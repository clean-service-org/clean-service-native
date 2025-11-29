import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="service/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="booking/index"
        options={{
          title: 'Booking',
          headerTitleAlign: 'center',
        }}
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
