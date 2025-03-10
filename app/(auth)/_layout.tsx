import { Stack } from "expo-router";

const AuthLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="main" options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" options={{ headerShown: false }} />
            <Stack.Screen name="CreateAccount" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AuthLayout;
