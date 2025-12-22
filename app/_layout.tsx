import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Stack } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@/contexts/AuthContext';

import './globals.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: true }} />

            <Stack.Screen name="customer" options={{ headerShown: false }} />

            <Stack.Screen name="employee" options={{ headerShown: false }} />

            <Stack.Screen name="task" options={{ headerShown: false }} />
          </Stack>
        </BottomSheetModalProvider>
        <Toast />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

