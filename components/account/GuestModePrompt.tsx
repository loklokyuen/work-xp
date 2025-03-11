import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "@/app/styles";
import { router } from "expo-router";
import { auth } from "@/database/firebase";
import { useUserContext } from "@/context/UserContext";

export default function GuestModePrompt() {
    const { setUser, setAccountType } = useUserContext();

    return (
        <View>
            <Text variant="titleMedium" style={{ textAlign: "center", margin: 20 }}>
                You are currently in guest mode. Please sign in to enjoy the full functionalities.
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained-tonal"
                    onPress={async () => {
                        await auth.signOut();
                        setUser(null);
                        setAccountType(null);
                        router.replace("/(auth)/CreateAccount");
                    }}
                >
                    Create Account
                </Button>
                <Button
                    mode="contained-tonal"
                    onPress={async () => {
                        await auth.signOut();
                        setUser(null);
                        setAccountType(null);
                        router.replace("/(auth)/SignIn");
                    }}
                >
                    Sign In
                </Button>
            </View>
        </View>
    );
}
