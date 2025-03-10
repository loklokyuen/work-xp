import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Banner } from "react-native-paper";
import BusinessList from "@/components/explore/BusinessList";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
    const [visible, setVisible] = useState(true);

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
                <Text>Welcome to Work-XP! Please search for a business to get exploring!</Text>
            </Banner>
            <BusinessList />
        </>
    );
};

export default HomeScreen;
