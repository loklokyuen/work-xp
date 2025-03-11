import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Banner, useTheme } from "react-native-paper";
import BusinessList from "@/components/explore/BusinessList";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [visible, setVisible] = useState(true);
  const { colors, fonts } = useTheme();

  return (
    <>
      <Banner
        visible={visible}
        actions={[
          {
            label: "Dismiss",
            onPress: () => setVisible(false),
          },
        ]}
        icon={() => (
          <MaterialCommunityIcons name="airplane-takeoff" size={24} />
        )}
      >
        <Text style={{ fontFamily: "SpaceMono" }}>
          Welcome to Work-XP! Please search for a business to get exploring!
        </Text>
      </Banner>
      <BusinessList />
    </>
  );
};

export default HomeScreen;
