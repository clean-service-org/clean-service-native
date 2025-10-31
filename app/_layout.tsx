import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="employee" options={{ headerShown: false }} />
  </Stack>;
}
