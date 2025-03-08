import { Stack } from "expo-router";

const AccountLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="read" options={{ headerShown: false }} />
            <Stack.Screen name="edit" options={{ headerShown: false }} />
            <Stack.Screen name="Guest" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AccountLayout;
