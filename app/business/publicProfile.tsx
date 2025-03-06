import OpportunityCards from "@/components/profile/opportuntiesCard";
import ReviewCard from "@/components/profile/reviewCard";
import { getBusinessById } from "@/database/business";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { List } from "react-native-paper";

const publicComProfile: React.FC = () => {
  const navigation = useNavigation();
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const [business, setBusiness] = useState<Business | null>(null);

  // Accordion state
  const [expanded, setExpanded] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: 'Back to all' });
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
    fetchData();
  }, [uid]);

  if (loading) {
    return <Text>Loading business profile...</Text>;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* banner image */}
        <Image source={{ uri: business.photoUrl }} style={styles.bannerImage} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{business.displayName} </Text>
          <Text style={styles.industry}> {business.sector} </Text>
          <Text style={styles.desc}> {business.description}</Text>
        </View>

        <List.Section>
          <List.Accordion
            title="Contact Info"
            titleStyle={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
            style={{ backgroundColor: "#3E92CC" }}
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}
          >
            <View style={styles.accordionContent}>
              <Text style={styles.text}>Email: {business.email}</Text>
              <Text style={styles.text}>
                Visit us: {business.address}, {business.county}
              </Text>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Chat</Text>
              </Pressable>
            </View>
          </List.Accordion>
        </List.Section>

        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>Work Experience Available</Text>
          {/* opportunitites component to pull in */}
          <OpportunityCards />
        </View>

        <Text style={styles.reviewsHeader}>Hear from past students</Text>
        {/* reviews carousel */}
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
