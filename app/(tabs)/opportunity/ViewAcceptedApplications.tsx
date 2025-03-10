import { useUserContext } from "@/context/UserContext";
import { getApplicationByStudentId } from "@/database/applications";
import { unsubscribe } from "diagnostics_channel";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import React, { Button, List, useTheme } from "react-native-paper";
import { Redirect } from "expo-router";

export default function ViewAcceptedApplications() {
  const { user, accountType } = useUserContext();
  const [applications, setApplications] = useState<Application1[]>([]);
  const [expanded, setExpanded] = useState(false);
  const { colors, fonts } = useTheme();

  if (accountType === "Business") {
    return <Redirect href="/+not-found" />;
  }

  useEffect(() => {
    const fetchApplications = async () => {
      if (user?.uid) {
        try {
          const fetchedApplications = await getApplicationByStudentId(user.uid);
          setApplications(fetchedApplications);
        } catch (error) {
          console.log("error fetching applications" + error);
        }
      }
    };

    fetchApplications();
  }, [user]);
  return (
    <List.Section>
      {" "}
      {applications.map((application) => {
        return (
          <List.Accordion
            title={application.businessName}
            titleStyle={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: "SpaceMono",
            }}
            style={
              application.isAccepted
                ? { backgroundColor: colors.secondary }
                : { backgroundColor: "#F5CA6B" }
            }
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}
          >
            <View style={styles.accordionContent}>
              <Text
                style={{
                  fontFamily: "SpaceMono",
                  color: colors.tertiary,
                  padding: 20,
                }}
              >
                Applied to: {application?.businessName}
              </Text>
              {application.isAccepted && (
                <Text
                  style={{
                    fontFamily: "SpaceMono",
                    color: colors.tertiary,
                    padding: 20,
                  }}
                >
                  You have been accepted for this role!
                </Text>
              )}
            </View>
          </List.Accordion>
        );
      })}
    </List.Section>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  textContainer: {
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 24,
  },
  subtitle: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    // marginTop: 60,
  },
  reviewsHeader: {
    textAlign: "center",
    paddingTop: 50,
    paddingBottom: 40,
    fontSize: 18,
    fontWeight: "bold",
  },
  industry: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  desc: {
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
  },
  text: {
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 16,
  },
  textOnWhite: {
    color: "black",
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
  },
  accordionContent: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#795663",
    padding: 13,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 2,
    width: 125,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
