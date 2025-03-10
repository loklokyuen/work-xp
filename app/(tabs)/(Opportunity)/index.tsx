import { useState, useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";
import { View, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";
import { doc, onSnapshot, collection, deleteDoc } from "firebase/firestore";
import { db } from "../../../database/firebase";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Opportunities() {
    const { user } = useUserContext();
    const [opportunities, setOpportunities] = useState<any[]>([]);

    useEffect(() => {
        if (user?.uid) {
            const collectionRef = collection(db, "Business", user.uid, "Opportunities");
            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                setOpportunities(
                    snapshot.docs.map((doc) => {
                        return { id: doc.id, ...doc.data() };
                    })
                );
            });
            return () => {
                setOpportunities([]);
                unsubscribe();
            };
        }
    }, [user?.uid]);

    const handleDelete = async (id: string) => {
        try {
            if (user)
                await deleteDoc(doc(db, "Business", user.uid, "Opportunities", id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ScrollView>
            <View>
                {opportunities.length === 0? <Text variant="bodyMedium" style={{padding: 20, textAlign: "center"}}>You have not posted any opportunity yet.</Text> :
                    opportunities.map((opp, index) => {
                    return (
                        <View style={styles.card} key={index}>
                            <Text style={styles.role}>{opp.jobRole}</Text>
                            <Text style={styles.description}>{opp.description}</Text>
                            <Button
                                onPress={() => {
                                    router.push({
                                        pathname: "./listingPage",
                                        params: { id: opp.id },
                                    });
                                }}
                            >Edit Listing</Button>
                            <Button onPress={() => handleDelete(opp.id)}>
                                Delete Listing
                                </Button>
                            <Button
                                onPress={() => {
                                    router.push({
                                        pathname: "./applications",
                                        params: { id: opp.id },
                                    });
                                }}
                            >View Applications</Button>
                        </View>
                    );
                })}
            </View>
            <Button mode="contained" style={{ marginHorizontal: 20 }}
                onPress={() => {
                    router.push({
                        pathname: "./listingPage",
                        params: { id: "" },
                    });
                }}
            >Post Listing</Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },
    role: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginBottom: 6,
    },
    availability: {
        fontSize: 12,
        color: "#007bff",
        fontWeight: "600",
    },
});
