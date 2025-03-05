import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from "react-native";
import { arrayUnion, doc, updateDoc, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { db } from "../database/firebase.js";

export default function OpportunityCard({ availability, description, jobRole, id }: OpportunityCardProps) {
    const { user, setUser } = useUserContext();

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "Business", user.uid, "Opportunities", id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.role}>{jobRole}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.availability}>
                availability: {availability[0]}-{availability[1]}
            </Text>
            <Button
                title="Edit Listing"
                onPress={() => {
                    router.replace({
                        pathname: "/(tabs)/EditListing",
                        params: { availability, description, jobRole, id },
                    });
                }}
            />
            <Button title="Delete Listing" onPress={handleDelete} />
        </View>
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
