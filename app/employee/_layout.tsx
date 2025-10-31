import { Stack } from "expo-router";

export default function SignUpLayout() {
    return (
        <Stack
            screenOptions={{ headerTitleAlign: "center" }}
        >
            <Stack.Screen
                name="signup/index"
                options={{ title: "Register" }}
            />
            <Stack.Screen
                name="signin/index"
                options={{ title: "Login" }}
            />
            <Stack.Screen
                name="onboarding/index"
                options={{ title: "Login or register" }}
            />
        </Stack>
    );
}
