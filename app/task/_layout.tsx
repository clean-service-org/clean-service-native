import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function TaskLayout() {
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
        name="[id]/info/index"
        options={{
          title: 'Task Information',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="[id]/start/index"
        options={{
          title: 'Start Task',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="[id]/in-progress/index"
        options={{
          title: 'Task In Progress',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="[id]/finish/index"
        options={{
          title: 'Finish Task',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="[id]/report/index"
        options={{
          title: 'Task Report',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="[id]/preview/index"
        options={{
          title: 'Preview Report',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="[id]/success/index"
        options={{
          title: 'Success',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
          headerLeft: () => null,
        }}
      />
    </Stack>
  );
}
