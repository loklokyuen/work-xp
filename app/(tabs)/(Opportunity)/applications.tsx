import { db } from "../../../database/firebase";
import {
  getApplicationsByBusinessId,
  updateApplicationAccepted,
} from "@/database/applications";
import { getApplicationsByOppId } from "@/database/applications";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { StyleSheet, Image } from "react-native";
import { View, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";

export default function Applications() {
  const [applications, setApplications] = useState<Application1[]>();
  const { user } = useUserContext();
  const { id } = useLocalSearchParams<Record<string, string>>();

  useEffect(() => {
    if (id) {
      getApplicationsByOppId(id).then((res) => {
        console.log(res);
        setApplications(res);
      });
    }
  }, [id]);

  console.log(applications);

  return (
    <ScrollView>
      <View style={styles.card}>
        {applications?.map((application, index) => {
          return (
            <View style={styles.card} key={index}>
              <Text style={styles.text}>
                Username:{application.displayName}
              </Text>
              <Image
                source={{ uri: application.photoUrl }}
                style={{ width: 200, height: 200 }}
              ></Image>
              <Text style={styles.text}>
                Why they applied:{application.whyApply}
              </Text>
              <Text style={styles.text}>
                Why they think they're suitable:{application.whySuitable}
              </Text>
              <Text style={styles.text}>
                Chosen subjects:{application.subjects}
              </Text>
              <Text style={styles.text}>
                Previous experience:{application.experience}
              </Text>
              <Text style={styles.text}>
                Dates applied for:{" "}
                {Object.keys(application.datesApplied).map((date) => (
                  <Text key={date}> {date}, </Text>
                ))}
              </Text>
              <Button mode="contained"
                onPress={() => updateApplicationAccepted(application.uid, true)}
              >Accept application</Button>
              <Button mode="contained"
                onPress={() =>
                  updateApplicationAccepted(application.uid, false)
                }
              >Decline application</Button>
            </View>
          );
        })}
      </View>
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
  text: {
    fontSize: 18,
    // fontWeight: "bold",
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
