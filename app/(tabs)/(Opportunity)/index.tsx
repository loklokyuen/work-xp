import { useState, useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";
import { View, ScrollView, Text, Button } from "react-native";
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
            await deleteDoc(doc(db, "Business", user.uid, "Opportunities", id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ScrollView>
            <View>
                {opportunities.map((opp, index) => {
                    return (
                        <View style={styles.card} key={index}>
                            <Text style={styles.role}>{opp.jobRole}</Text>
                            <Text style={styles.description}>{opp.description}</Text>
                            <Button
                                title="Edit Listing"
                                onPress={() => {
                                    router.push({
                                        pathname: "./listingPage",
                                        params: { id: opp.id },
                                    });
                                }}
                            />
                            <Button title="Delete Listing" onPress={() => handleDelete(opp.id)} />
                            <Button
                                title="View Applications"
                                onPress={() => {
                                    router.push({
                                        pathname: "./applications",
                                        params: { id: opp.id },
                                    });
                                }}
                            ></Button>
                        </View>
                    );
                })}
            </View>
            <Button
                title="Post Listing"
                onPress={() => {
                    router.push({
                        pathname: "./listingPage",
                        params: { id: "" },
                    });
                }}
            ></Button>
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
