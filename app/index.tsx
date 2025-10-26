import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import Button from '../components/Button';
import InputWithLabel from '../components/Input';

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-light-100 font-bold">
        NativeWind has been setup!.
      </Text>
      <Button onPress={() => alert('Button Pressed!')}>Custom Button</Button>
      <InputWithLabel placeholder="Enter text" label="paso peso" />
      <Link href="/home">
        <Text className="text-blue-500">Go to Home</Text>
      </Link>
      <Link href="/customer/verify">
        <Text className="text-blue-500">Go to Verify</Text>
      </Link>
    </View>
  );
}
