import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "@/app/styles";
import { router } from "expo-router";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Guest() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.scrollViewContent}>
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
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
