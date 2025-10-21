import { Pressable, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
}

export default function Button({ children, onPress, className }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex bg-[#1A78F2] px-8 py-4 rounded-lg ${className}`}
    >
      <Text className="text-white text-center font-bold">{children}</Text>
    </Pressable>
  );
}
