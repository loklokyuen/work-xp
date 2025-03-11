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
import { Text, Button, useTheme } from "react-native-paper";
import { Redirect } from "expo-router";
import ApplicationCard from "./ApplicationCard";

export default function Applications() {
  const [applications, setApplications] = useState<Application1[]>([]);
  const { user, accountType } = useUserContext();
  const { id } = useLocalSearchParams<Record<string, string>>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { colors, fonts } = useTheme();

  if (accountType === "Student") {
    return <Redirect href="/+not-found" />;
  }

  useEffect(() => {
    if (id) {
      getApplicationsByOppId(id)
        .then((res) => {
          const filteredApplications = res.filter(
            (application) =>
              application.isAccepted === undefined ||
              application.isAccepted === null
          );
          setApplications(filteredApplications);
        })
        .catch((error) => {
          console.error("Error fetching applications:", error);
        });
    }
  }, [id]);

  const handleDecision = async (uid: string, accepted: boolean) => {
    try {
      await updateApplicationAccepted(uid, accepted);
      setSuccessMessage(
        `You have successfully ${
          accepted ? "accepted" : "declined"
        } this application.`
      );

      if (id) {
        const updatedApplications = await getApplicationsByOppId(id);
        const filteredApplications = updatedApplications.filter(
          (application) =>
            application.isAccepted === undefined ||
            application.isAccepted === null
        );
        setApplications(filteredApplications);
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  return (
    <ScrollView>
      {successMessage && (
        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              color: colors.tertiary,
              fontWeight: "bold",
              fontSize: 15,
              fontFamily: "Lato",
              alignContent: "center",
              margin: 10,
            }}
          >
            {successMessage}
          </Text>
        </View>
      )}

      <View style={{ alignContent: "center" }}>
        {applications.map((application, index) => (
          <ApplicationCard
            key={index}
            application={application}
            onDecision={handleDecision}
          />
        ))}
      </View>
    </ScrollView>
  );
}
