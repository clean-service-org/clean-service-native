import { Stack } from 'expo-router';
import { View } from 'react-native';

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
      })}
    >
      <Stack.Screen
        name="test/index"
        options={{
          title: 'Onboarding Checklist',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="assessment/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="introduction-to-cleany/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="how-to-get-jobs/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="professional-conduct/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="update-profile/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _Layout;
