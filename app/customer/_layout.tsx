import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

const _Layout = () => {
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
              borderBottomColor: '#DADADA', // Đường xám nè
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
    </Stack>
  );
};

export default _Layout;
