import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "react-native-paper";
import { getBusinessReviews } from "@/database/business";
import { SafeAreaView } from "react-native-safe-area-context";
import { Rating } from "react-native-ratings";

const screenWidth = Dimensions.get("window").width;

interface ReviewCardProps {
  businessId: string;
}
const ReviewCard: React.FC<ReviewCardProps> = ({ businessId }) => {
  // export default function ReviewCard: React.FC<ReviewCardProps> = ({ businessId }) {
  const { colors, fonts } = useTheme();
  const [reviews, setReviews] = useState<Review[] | []>([]);

  // Get data
  useEffect(() => {
    getBusinessReviews(businessId).then((res) => {
      if (res) {
        setReviews(res);
      } else {
        setReviews([]);
      }
    });
  }, [businessId]);

  // Msg if reviews data is not available yet
  if (reviews.length === 0) {
    return (
      <Text style={styles.body}>
        We're waiting for our first review! Could it be you? 
      </Text>
    );
  }

  // Render carousel items____
  // const renderItem = ({ item }) => (
  //   <View
  //     style={StyleSheet.compose(styles.card, {
  //       backgroundColor: colors.primaryContainer,
  //     })}
  //   >
  //     <Text
  //       style={StyleSheet.compose(styles.review, {
  //         color: colors.primary,
  //         fontFamily: "SpaceMono",
  //         fontWeight: "normal",
  //       })}
  //     >
  //       "{item.review}"
  //     </Text>
  //     <Text
  //       style={StyleSheet.compose(styles.name, {
  //         color: colors.tertiary,
  //         fontFamily: "SpaceMono",
  //         fontSize: 15,
  //         fontWeight: "bold",
  //       })}
  //     >
  //       {item.name}
  //     </Text>
  //   </View>
  // );

  return (
    <SafeAreaView style={styles.revContainer}>
      <ScrollView contentContainerStyle={styles.revScrollViewContent}>
        {reviews.map((item, index) => (
          <View key={index} style={styles.revCard}>
            {/* Use the Rating component to display star ratings */}
            <Rating
              imageSize={24}
              readonly
              startingValue={item.stars}
              ratingColor="#ffcc00"
              ratingBackgroundColor="white"
              tintColor="#1E80A4"
              style={styles.revStars}
            />
            {/* <Text style={styles.revStars}>{`${item.stars} Stars`}</Text> */}
            <Text style={styles.revBody}>"{item.review}"</Text>
            <Text style={styles.revName}>{item.studentName}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>

    // <Carousel
    //   data={data}
    //   renderItem={renderItem}
    //   width={screenWidth}
    //   height={screenWidth / 2}
    //   loop={true}
    //   autoPlay={true}
    //   autoPlayInterval={2000}
    // />
  );
};

const styles = StyleSheet.create({
  revContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  revScrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  revCard: {
    width: screenWidth - 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginVertical: 20,
    padding: 30,
    backgroundColor: "#1E80A4",
  },
  revStars: {
    marginBottom: 15,
  },
  revBody: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    color: "white",
  },
  revName: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "white",
  },
    body: {
    fontSize: 15,
    margin: 16,
    textAlign: "center",
  },
});

export default ReviewCard;
