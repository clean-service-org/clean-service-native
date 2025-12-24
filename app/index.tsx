import { useAuth } from '@/contexts/AuthContext';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const url = Linking.useLinkingURL();
  const router = useRouter();
  const { userData, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (url) {
      // Parse the URL for deep linking
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log('Deep link data:', { hostname, path, queryParams });
    }
  }, [url]);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Route based on auth state
    if (!isAuthenticated) {
      // Not logged in -> Customer index (guest mode)
      router.replace('/customer/(tabs)');
    } else {
      // Logged in -> Check userType
      if (userData?.userType === 'Customer') {
        router.replace('/customer/(tabs)');
      } else if (userData?.userType === 'Employee') {
        router.replace('/employee/home');
      } else {
        // Fallback to customer
        router.replace('/customer/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, userData?.userType]);

  // Show loading screen while checking auth
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#1A78F2" />
    </View>
  );
}

