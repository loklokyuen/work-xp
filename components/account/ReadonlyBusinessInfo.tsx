import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { StyleSheet, Platform, View } from "react-native";
import { router } from "expo-router";
import styles from "@/app/styles";

export function ReadonlyBusinessInfo({ businessInfo }: BusinessProps) {
    if (businessInfo)
        return (
            <>
                <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                    Company Bio:
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <Text variant="bodyMedium" style={{ flex: 1, width: 1, margin: 12, borderWidth: 1, padding: 10, minHeight: 40 }}>
                        {businessInfo.description}
                    </Text>
                </View>
                <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                    Industry:
                </Text>
                <Text variant="bodyMedium" style={styles.data}>
                    {businessInfo.sector}
                </Text>
                <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                    Telephone:
                </Text>
                <Text variant="bodyMedium" style={styles.data}>
                    {businessInfo.phoneNumber}
                </Text>
                <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                    Email:
                </Text>
                <Text variant="bodyMedium" style={styles.data}>
                    {businessInfo.email}
                </Text>
                <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                    Address:
                </Text>
                <Text variant="bodyMedium" style={styles.data}>
                    {businessInfo.address}
                </Text>
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained-tonal"
                        onPress={() => {
                            router.push({ pathname: "/(tabs)/opportunity/(Business)/Opportunities" });
                        }}
                    >
                        View ads
                    </Button>
                    <Button
                        mode="contained-tonal"
                        onPress={() => {
                            router.push({ pathname: "/(tabs)/opportunity/(Business)/manageBooking" });
                        }}
                    >
                        Manage Booking
                    </Button>
                </View>
            </>
        );
}
