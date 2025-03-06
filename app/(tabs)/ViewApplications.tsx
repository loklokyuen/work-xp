import { db } from "../../database/firebase";
import { getApplicationsByBusinessId } from "@/database/applications";
import { getApplicationsByOppId } from "@/database/applications";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { StyleSheet } from "react-native";
import { View, ScrollView, Text, Button } from "react-native";

export default function ViewApplications() {
  const [applications, setApplications] = useState<Application1[]>();
  const { user } = useUserContext();
  const { id } = useLocalSearchParams<Record<string, string>>();

  console.log(id);

  useEffect(() => {
    getApplicationsByOppId(id).then((res) => {
      console.log(res);
      setApplications(res);
    });
  }, [id]);

  console.log(applications);

  return (
    <ScrollView>
      <View style={styles.card}>
        {applications?.map((application, index) => {
          return (
            <View style={styles.card} key={index}>
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
