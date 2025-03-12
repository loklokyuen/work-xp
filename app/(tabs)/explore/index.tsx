import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Banner, Button, useTheme } from "react-native-paper";
import BusinessList from "@/components/explore/BusinessList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OpportunityList from "@/components/explore/exploreOpportunities";
import { useUserContext } from "@/context/UserContext";

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
                icon={() => <MaterialCommunityIcons name="airplane-takeoff" size={24} />}
            >
                <Text style={{ fontFamily: "Lato" }}>Welcome to Work-XP! Please search for a business to get exploring!</Text>
            </Banner>
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
                // mode="outlined"
                onPress={() => {
                    setSearchType("Business");
                }}
            >
                Search by business
            </Button>
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
                // mode="outlined"
                onPress={() => {
                    setSearchType("Opportunity");
                }}
            >
                Search by opportunity
            </Button>
            {searchType === "Business" ? <BusinessList /> : <OpportunityList />}
        </>
    );
};

export default HomeScreen;
