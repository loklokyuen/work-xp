import React, { useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

export default function ReviewCard() {
  const screenWidth = Dimensions.get("window").width;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.review}>"{item.review}"</Text>
      <Text style={styles.name}>{item.name}</Text>
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
  ];

  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      width={screenWidth}
      height={screenWidth / 2}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#795663",
    padding: 30,
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
    color: "#FFFAFF",
  },
  name: {
    fontSize: 14,
    color: "#FFFAFF",
  },
});
