import { Link, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';
import Button from '../components/Button';
import InputWithLabel from '../components/Input';
import { useEffect } from 'react';

export default function Index() {
    const url = Linking.useLinkingURL();
    const router = useRouter();

    useEffect(() => {
    if (url) {
      // Parse the URL
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log('Deep link data:', { hostname, path, queryParams });
      
      // Navigate to appropriate screen
      // navigation.navigate(path, queryParams);
    }
  }, [url]);

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-light-100 font-bold">
        NativeWind has been setup!.
      </Text>
      <Button onPress={() => alert('Button Pressed!')}>Custom Button</Button>
      <Button onPress={() => router.navigate('/employee/onboarding')}>Custom Button</Button>
      <InputWithLabel placeholder="Enter text" label="paso peso" />
      <Link href="/customer/(tabs)">
        <Text className="text-blue-500">Go to Home</Text>
      </Link>
      <Link href="/customer/(auth)/verify">
        <Text className="text-blue-500">Go to Verify</Text>
      </Link>
      <Link href="/employee/home">
        <Text className="text-blue-500">Go to Employee Home</Text>
      </Link>
      <Link href="/task/1/info">
        <Text className="text-blue-500">Go to Task Info</Text>
      </Link>
    </View>
  );
}
