import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import {
  arrayUnion,
  doc,
  updateDoc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { db } from "../database/firebase.js";
import { useRefreshContext } from "@/context/RefreshContext.tsx";

interface OpportunityCardProps {
  Availability: string;
  Description: string;
  JobRole: string;
}

export default function OpportunityCard({
  Availability,
  Description,
  JobRole,
}: OpportunityCardProps) {
  const { user, setUser } = useUserContext();
  const [oppToRemove, setOppToRemove] = useState({});

  const { triggerRefresh } = useRefreshContext();

  const handleDelete = async () => {
    const docRef = doc(db, "Business", user.uid);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const opportunitiesArray = data.Opportunities;

        const singleOpp = opportunitiesArray.find(
          (opportunity: OpportunityCardProps) =>
            opportunity.Availability === Availability
        );
        if (singleOpp) {
          setOppToRemove(singleOpp);

          await updateDoc(docRef, {
            Opportunities: arrayRemove(singleOpp),
          });
          triggerRefresh();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.role}>{JobRole}</Text>
      <Text style={styles.description}>{Description}</Text>
      <Text style={styles.availability}>Availability: {Availability}</Text>
      <Button
        title="Edit Listing"
        onPress={() => {
          router.replace({
            pathname: "/(tabs)/EditListing",
            params: { Availability, Description, JobRole },
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
