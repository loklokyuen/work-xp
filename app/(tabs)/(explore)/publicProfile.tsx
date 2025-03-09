import OpportunityCards from "@/components/profile/opportuntiesCard";
import ReviewCard from "@/components/profile/reviewCard";
import { getBusinessById, getBusinessOpportunities } from "@/database/business";
import { color } from "@cloudinary/url-gen/qualifiers/background";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { Button, List, useTheme } from "react-native-paper";

const publicComProfile: React.FC = () => {
  const navigation = useNavigation();
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Accordion state
  const [expanded, setExpanded] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  // Get the theme
  const { colors } = useTheme();

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: "Back to all" });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBusiness = await getBusinessById(uid);
        setBusiness(fetchedBusiness);
      } catch (error) {
        console.error("Error fetching business:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchOpportunities = async () => {
      try {
        const fetchedOpportunities = await getBusinessOpportunities(uid);
        setOpportunities(fetchedOpportunities);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchOpportunities();
  }, [uid]);

  if (loading) {
    return <Text>Loading business profile...</Text>;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* banner image */}
        <Image
          source={{ uri: business?.photoUrl }}
          style={styles.bannerImage}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { color: colors.onSurface, fontFamily: "SpaceMono" },
            ]}
          >
            {business?.displayName}{" "}
          </Text>
          <Text
            style={[
              styles.industry,
              { color: colors.primary, fontFamily: "SpaceMono" },
            ]}
          >
            {" "}
            {business?.sector}{" "}
          </Text>
          <Text
            style={[
              styles.desc,
              { color: colors.onBackground, fontFamily: "SpaceMono" },
            ]}
          >
            {" "}
            {business?.description}
          </Text>
        </View>
        {/* contact info */}
        <List.Section>
          <List.Accordion
            title="Contact Info"
            titleStyle={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: colors.onPrimary,
              fontFamily: "SpaceMono",
            }}
            style={{ backgroundColor: colors.primary }}
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}
          >
            <View style={styles.accordionContent}>
              <Text
                style={[
                  styles.text,
                  { color: colors.onSurface, fontFamily: "SpaceMono" },
                ]}
              >
                Email: {business?.email}
              </Text>
              <Text
                style={[
                  styles.text,
                  { color: colors.onSurface, fontFamily: "SpaceMono" },
                ]}
              >
                Visit us: {business?.address}, {business?.county}
              </Text>
              <Button
                mode="contained"
                labelStyle={{
                  fontFamily: "SpaceMono",
                  color: colors.onSecondary,
                }}
                style={{
                  backgroundColor: colors.secondary,
                }}
                onPress={() => {
                  // Navigate to chat page
                }}
              >
                Chat
              </Button>
            </View>
          </List.Accordion>
        </List.Section>

        {/* opportunitites (work experience listings per business)*/}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.subtitle,
              { color: colors.onSurface, fontFamily: "SpaceMono" },
            ]}
          >
            Work Experience Available
          </Text>
          <OpportunityCards opportunities={opportunities} businessId={uid} />
        </View>

        {/* reviews carousel */}
        <Text
          style={[
            styles.reviewsHeader,
            { color: colors.tertiary, fontFamily: "SpaceMono", flex: 10 },
          ]}
        >
          Hear from past students
        </Text>
        <ReviewCard />
      </ScrollView>
    </>
  );
};

export default publicComProfile;

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
  accordionContent: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },
});
