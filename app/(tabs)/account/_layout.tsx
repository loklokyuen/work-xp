import { Stack } from "expo-router";

const AccountLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="businessProfile" options={{ headerShown: false }} />
            <Stack.Screen name="studentProfile" options={{ headerShown: false }} />
            <Stack.Screen name="guestProfile" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AccountLayout;
