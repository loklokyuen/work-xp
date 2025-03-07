import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "@/app/styles";

type GuestProps = {
    clearGuestMode: ( clearGuestMode: boolean) => void;
};
export default function GuestModePrompt({ clearGuestMode }: GuestProps) {
    return <View>
    <Text variant="titleMedium" style={{ textAlign: "center", margin: 20 }}>
        You are currently in guest mode. Please sign in to enjoy the full functionalities.
    </Text>
    <View style={styles.buttonContainer}>
        <Button
            mode="contained-tonal"
            onPress={() => {
                clearGuestMode(true);
            }}
        >
            Create Account
        </Button>
        <Button
            mode="contained-tonal"
            onPress={() => {
                clearGuestMode(false);
            }}
        >
            Sign In
        </Button>
    </View>
</View>
}