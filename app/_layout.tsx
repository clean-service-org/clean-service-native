import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './globals.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: true }} />
          <Stack.Screen name="customer" options={{ headerShown: false }} />
          <Stack.Screen name="employee" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
