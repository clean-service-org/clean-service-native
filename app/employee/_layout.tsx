import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function SignUpLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderBottomWidth: 10,
              borderBottomColor: '#DADADA',
            }}
          />
        ),
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
    >
      <Stack.Screen
        name="signup/index"
        options={{
          title: 'Register',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="signin/index"
        options={{
          title: 'Login',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="onboarding/index"
        options={{
          title: 'Login or register',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="home/index"
        options={{
          title: 'Home',
          headerShown: false,
          headerBackground: undefined,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerBackground: undefined,
        }}
      />
    </Stack>
  );
}
