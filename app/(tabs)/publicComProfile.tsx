import OpportunityCards from "@/components/profile/opportuntiesCard";
import ReviewCard from "@/components/profile/reviewCard";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import {
  Banner,
  Button,
  Divider,
  Modal,
  PaperProvider,
  Portal,
  List,
} from "react-native-paper";

const publicComProfile: React.FC = () => {
  interface IndividualBusiness {
    uid: string;
    displayName: string;
    sector: string;
    photoUrl: string;
    email: string;
    address: string;
    county: string;
    description: string;
    // opportunities: Opportunity[];
    // reviews: Review[];
    // applications: Applciations[];
  }

  // TEST DATA
  const aBusiness: IndividualBusiness[] = [
    {
      uid: "test",
      displayName: "R&J Mechanics",
      sector: "Motor",
      photoUrl:
        "https://www.cityofbristol.ac.uk/wp-content/uploads/Motor-Vehicle-small-scaled.jpg",
      email: "test@company.com",
      address: "1 Lambo Way",
      county: "London",
      description: "Some test description about the company here",
      //   opportunities: ["Mechanic"],
      //   reviews: [1,"Great!", "Stu"],
      //   applications: [1],
    },
  ];

  // Accordion state
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* banner image */}
        <Image
          source={{ uri: aBusiness[0].photoUrl }}
          style={styles.bannerImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{aBusiness[0].displayName} </Text>
          <Text style={styles.industry}> {aBusiness[0].sector} </Text>
          <Text style={styles.desc}> {aBusiness[0].description}</Text>
        </View>

        <List.Section>
          <List.Accordion
            title="Contact Info"
            titleStyle={{ textAlign: "center" }}
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}
          >
            <View style={styles.accordionContent}>
              <Text style={styles.text}>Email: {aBusiness[0].email}</Text>
              <Text style={styles.text}>
                Visit us: {aBusiness[0].address}, {aBusiness[0].county}
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
    paddingBottom: 10,
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
    padding: 10,
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
