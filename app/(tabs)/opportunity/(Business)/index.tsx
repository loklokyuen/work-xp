import { View } from "react-native";
import { Button } from "react-native-paper";
import styles from "@/app/styles";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";

export default function Briefcase() {
    const { user } = useUserContext();

    return (
        <View style={styles.buttonContainer}>
            <Button
                mode="contained-tonal"
                onPress={() => {
                    router.push({ pathname: "/(tabs)/opportunity/(Business)/Opportunities" });
                }}
            >
                Manage Listings
            </Button>
            <Button
                mode="contained-tonal"
                onPress={() => {
                    router.push({ pathname: "/(tabs)/opportunity/(Business)/manageBooking" });
                }}
            >
                Manage Bookings
            </Button>
        </View>
    );
}
