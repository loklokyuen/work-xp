import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

const AuthLayout = () => {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <View style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="main" options={{ headerShown: false }} />
                    <Stack.Screen name="SignIn" options={{ headerShown: false }} />
                    <Stack.Screen name="CreateAccount" options={{ headerShown: false }} />
                </Stack>
            </View>
        </SafeAreaView>
    );
};

export default AuthLayout;
