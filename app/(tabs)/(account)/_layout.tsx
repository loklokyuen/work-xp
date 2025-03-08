import { Stack } from "expo-router";

const AccountLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="read" />
            <Stack.Screen name="edit" />
            <Stack.Screen name="Guest" />
        </Stack>
    );
};

export default AccountLayout;
