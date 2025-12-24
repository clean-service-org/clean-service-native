import { Pressable, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onPress,
  className,
  textClassName,
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex justify-center items-center bg-[#1A78F2] px-8 py-4 rounded-lg ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      <Text
        className={`text-center font-bold ${textClassName || 'text-white'}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
