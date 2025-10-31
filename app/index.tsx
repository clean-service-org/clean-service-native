import { Text, View } from 'react-native';
import Button from '../components/Button';
import InputWithLabel from '../components/Input';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-light-100 font-bold">
        NativeWind has been setup!.
      </Text>
      <Button onPress={() => alert('Button Pressed!')}>Custom Button</Button>
      <Button onPress={() => router.navigate('/employee/onboarding')}>Custom Button</Button>
      <InputWithLabel placeholder="Enter text" label="paso peso" />
    </View>
  );
}
