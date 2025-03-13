import { useUserContext } from "@/context/UserContext";
import { getApplicationByStudentId } from "@/database/applications";
import { getBusinessOpportunityById } from "@/database/business";
import { unsubscribe } from "diagnostics_channel";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import React, { Button, List, useTheme } from "react-native-paper";
import { Redirect, router, useNavigation } from "expo-router";
import Accordion from "./Accordian";

export default function ViewAcceptedApplications() {
  const navigation = useNavigation();
  const { user, accountType } = useUserContext();
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    null
  );
  const { colors, fonts } = useTheme();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Applications",
    });
  }, [navigation]);

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
          console.log("Error fetching applications:", error);
        }
      }
    };

    fetchApplications();
  }, [user]);

  // Fetch opportunities for the applications
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (applications.length > 0) {
        try {
          const opps = [];
          for (let application of applications) {
            const opportunity = await getBusinessOpportunityById(
              application.businessId,
              application.oppId
            );
            opps.push(opportunity);
          }
          setOpportunities(opps);
        } catch (error) {
          console.log("Error fetching opportunities:", error);
        }
      }
    };

    fetchOpportunities();
  }, [applications]);

  const handleAccordionPress = (uid: string) => {
    setExpandedAccordion((prev) => (prev === uid ? null : uid));
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <List.Section>
        {applications.length === 0 && (
          <Text style={styles.text}>No applications found</Text>
        )}
        {applications.map((application, index) => {
          const opportunity = opportunities[index];
          if (!application || !opportunity) {
            return null;
          }
          return (
            <Accordion
              key={application.uid}
              application={application}
              opportunity={opportunity}
              expanded={expandedAccordion === application.uid}
              onPress={() => handleAccordionPress(application.uid)}
            />
          );
        })}
      </List.Section>
      <Text
        style={[
          styles.title,
          {
            color: colors.onSecondary,
            ...fonts.bodyLarge,
            margin: 10,
            fontFamily: "Lato",
          },
        ]}
      >
        If you have finished your experience, please leave a review for other
        students to see how you got on!
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.onPrimary,
          }}
          onPress={() => {
            router.push({
              pathname: "./reviews",
              params: {},
            });
          }}
          mode="contained-tonal"
        >
          Leave a review here!
        </Button>
      </View>
    </ScrollView>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 5,
  },
  scrollViewContent: {
    paddingBottom: 75,
  },
});
