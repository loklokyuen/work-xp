import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import { useTheme } from "react-native-paper";
import { styleTransfer } from "@cloudinary/url-gen/actions/effect";
import { bold } from "@cloudinary/url-gen/qualifiers/fontWeight";
import { getBusinessReviews } from "@/database/business";

interface ReviewCardProps {
  businessId: string;
}
const ReviewCard: React.FC<ReviewCardProps> = ({ businessId }) => {
  // export default function ReviewCard: React.FC<ReviewCardProps> = ({ businessId }) {
  const screenWidth = Dimensions.get("window").width;
  const { colors, fonts } = useTheme();
  const [reviews, setReviews] = useState<Review[] | undefined>();

  useEffect(() => {
    getBusinessReviews(businessId).then((res) => {
      setReviews(res);
    });
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={StyleSheet.compose(styles.card, {
        backgroundColor: colors.primaryContainer,
      })}
    >
      <Text
        style={StyleSheet.compose(styles.review, {
          color: colors.primary,
          fontFamily: "Lato",
          fontWeight: "normal",
        })}
      >
        "{item.review}"
      </Text>
      <Text
        style={StyleSheet.compose(styles.name, {
          color: colors.tertiary,
          fontFamily: "Lato",
          fontSize: 15,
          fontWeight: "bold",
        })}
      >
        {item.name}
      </Text>
    </View>
  );

  const data = [
    {
      id: 1,
      review: "Great!",
      name: "Stu",
    },
    {
      id: 2,
      review: "Loved it",
      name: "Hue",
    },
    {
      id: 3,
      review: "Best experience ever!",
      name: "Lou",
    },
  ];

  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      width={screenWidth}
      height={screenWidth / 2}
      loop={true}
      autoPlay={true}
      autoPlayInterval={2000}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 35,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  review: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    // color: "#FFFAFF",
  },
  // name: {
  //   fontSize: 14,
  //   color: "#FFFAFF",
  // },
  carouselContainer: {
    flex: 1, // Allow the carousel to take up available space
  },
});

export default ReviewCard;
