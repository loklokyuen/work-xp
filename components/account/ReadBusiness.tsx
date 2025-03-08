import { ActivityIndicator, Button, IconButton, Text, TextInput } from "react-native-paper";
import { StyleSheet, Platform, View } from "react-native";
import { router } from "expo-router";
import styles from "@/app/styles";
import { useEffect, useState } from "react";
import { getBusinessById } from "@/database/business";
import { useUserContext } from "@/context/UserContext";

export function ReadBusiness() {
    const { user } = useUserContext();
    const [businessInfo, setBusinessInfo] = useState<Business>();
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        if (!user) return;
        getBusinessById(user.uid)
            .then((res) => {
                if (res) {
                    setBusinessInfo({
                        uid: res.uid,
                        displayName: res.displayName || "",
                        sector: res.sector || "",
                        photoUrl: res.photoUrl || "",
                        email: res.email || "",
                        address: res.address || "",
                        county: res.county || "",
                        description: res.description || "",
                        phoneNumber: res.phoneNumber || "",
                        opportunities: [],
                        reviews: [],
                        applications: [],
                    });
                    setLoading(false);
                    return true;
                } else return false;
            })
            .then((userFound) => {
                if (!userFound) {
                    setLoading(false);
                }
            });
    }, [user]);

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;

    return (
        <>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Company Bio:
            </Text>
            <View style={{ flexDirection: "row" }}>
                <Text variant="bodyMedium" style={{ flex: 1, width: 1, margin: 12, borderWidth: 1, padding: 10, minHeight: 40 }}>
                    {businessInfo?.description}
                </Text>
            </View>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Industry:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {businessInfo?.sector}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Telephone:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {businessInfo?.phoneNumber}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Email:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {businessInfo?.email}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Address:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {businessInfo?.address}
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained-tonal"
                    onPress={() => {
                        console.log("pressed");
                    }}
                >
                    View ads
                </Button>
                <Button
                    mode="contained-tonal"
                    onPress={() => {
                        router.push({ pathname: "/manageBooking", params: { businessId: businessInfo?.uid } });
                    }}
                >
                    Manage Booking
                </Button>
            </View>
        </>
    );
}
