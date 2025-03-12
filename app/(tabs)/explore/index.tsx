import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Banner, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUserContext } from "@/context/UserContext";
import ExploreMain from "@/components/explore/ExploreMain";

const HomeScreen = () => {
  const [visible, setVisible] = useState(true);
  const { colors, fonts } = useTheme();
  const { accountType } = useUserContext();
  const [searchType, setSearchType] = useState("Business");

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
        <Text style={{ fontFamily: "Lato" }}>
          Welcome to Work-XP! Please search for a business to get exploring!
        </Text>
      </Banner>
      <ExploreMain />
    </>
  );
};

export default HomeScreen;
