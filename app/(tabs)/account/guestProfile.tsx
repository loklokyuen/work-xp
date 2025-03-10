import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "@/app/styles";
import { router } from "expo-router";

export default function GuestModePrompt() {
    return (
        <View>
            <Text variant="titleLarge" style={{ textAlign: "center", margin: 15 }}>
                Guest
            </Text>
            <Text variant="titleMedium" style={{ textAlign: "center", margin: 20 }}>
                You are currently in guest mode. Please sign in to enjoy the full functionalities.
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained-tonal"
                    onPress={() => {
                        router.replace("/(auth)/CreateAccount");
                    }}
                >
                    Create Account
                </Button>
                <Button
                    mode="contained-tonal"
                    onPress={() => {
                        router.replace("/(auth)/SignIn");
                    }}
                >
                    Sign In
                </Button>
            </View>
        </View>
    );
}
