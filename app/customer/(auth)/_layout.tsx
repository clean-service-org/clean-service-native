import { Ionicons } from '@expo/vector-icons';

import { Stack, useRouter } from 'expo-router';

import { TouchableOpacity, View } from 'react-native';

const _Layout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
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
            onPress={() => {
              // Try to go back, if can't, go to customer tabs

              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/customer/(tabs)');
              }
            }}
            style={{
              paddingVertical: 8,
            }}
            activeOpacity={0.5}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="login/index"
        options={{
          title: 'Login',

          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />

      <Stack.Screen
        name="signup/index"
        options={{
          title: 'Register',

          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />

      <Stack.Screen
        name="verify/index"
        options={{
          title: '',

          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
    </Stack>
  );
};

export default _Layout;

