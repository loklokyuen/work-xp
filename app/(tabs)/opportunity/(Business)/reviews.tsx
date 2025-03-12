import { useUserContext } from "@/context/UserContext";
import { center } from "@cloudinary/url-gen/qualifiers/textAlignment";
import { View, ScrollView, Text, Platform, StyleSheet } from "react-native";
import { List, TextInput, Button, useTheme } from "react-native-paper";
import { useState, useEffect } from "react";
import { getApplicationByStudentId } from "@/database/applications";
import { Rating } from "react-native-ratings";
import { postReview } from "@/database/business";
import { updateReviewPosted } from "@/database/applications";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/database/firebase";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";

export default function ReviewsPage() {
  const { user } = useUserContext();
  const [oppsToReview, setOppsToReview] = useState<Application1[]>([]);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    null
  );
  const [currentBusinessId, setCurrentBusinessId] = useState("");
  const [currentOppId, setCurrentOppId] = useState("");

  const [review, setReview] = useState<string>("");
  const [stars, setStars] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { colors } = useTheme();
  useEffect(() => {
    getApplicationByStudentId(user.uid).then((res) => {
      const filteredArray = res.filter(
        (opp) => opp.isAccepted === true && !opp.reviewPosted
      );
      setOppsToReview(filteredArray);
    });
  }, [refreshTrigger]);

  const handleSubmit = async () => {
    postReview(currentBusinessId, review, stars, user?.displayName);
    updateReviewPosted(currentOppId, true);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ScrollView style={{ alignContent: center }}>
      <Text
        style={[styles.title, { color: colors.onSurface, fontFamily: "Lato" }]}
      >
        {" "}
        You need to leave a review for the following businesses
      </Text>

      {oppsToReview.map((opp, index) => {
        return (
          <List.Accordion
            key={index}
            title={opp.businessName}
            titleStyle={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: colors.onPrimary,
              fontFamily: "Lato",
            }}
            style={{ backgroundColor: colors.quarternary }}
            expanded={expandedAccordion === opp.uid}
            onPress={() => {
              setExpandedAccordion(
                expandedAccordion === opp.uid ? null : opp.uid
              );

              setReview("");
              setCurrentBusinessId(opp.businessId);
              setCurrentOppId(opp.uid);
            }}
          >
            <View>
              {/* <Text> {opp.businessName} </Text> */}

              <TextInput
                style={{ margin: 10 }}
                label="Leave a review here"
                mode="outlined"
                value={review}
                onChangeText={(review) => {
                  setReview(review);
                }}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              ></TextInput>
              <Rating
                type="custom"
                showRating
                onFinishRating={(rating: number) => setStars(rating)}
                style={{ paddingVertical: 10 }}
                ratingColor="#FFA500"
                tintColor="#FEF7FF"
                ratingBackgroundColor="#D3D3D3"
              />
              <View style={styles.buttonContainer}>
                <Button
                  style={{
                    backgroundColor: colors.secondary,
                    borderRadius: 8,
                    paddingLeft: 5,
                    paddingRight: 5,
                    marginBottom: 15,
                  }}
                  labelStyle={{
                    fontFamily: "Lato",
                    fontSize: 16,
                    fontWeight: "normal",
                    color: colors.onSecondary,
                  }}
                  mode="contained-tonal"
                  onPress={handleSubmit}
                >
                  Submit Review
                </Button>
              </View>
            </View>
          </List.Accordion>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    paddingBottom: 10,

    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 5,
  },
});
