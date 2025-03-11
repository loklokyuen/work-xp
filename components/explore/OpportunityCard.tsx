import { useUserContext } from "@/context/UserContext";
import { video } from "@cloudinary/url-gen/qualifiers/source";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button, Modal, PaperProvider, Portal, useTheme, Card } from "react-native-paper";
import styles from "@/app/styles";

interface opportunity {
    id: string;
    jobRole: string;
    description: string;
    businessId: string;
    businessName: string;
}

const OpportunityCard = ({ opp }: { opp: opportunity }) => {
    const { accountType } = useUserContext();

    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight * 0.3;

    // modal states
    const [oppModalvisible, setOppModalVisible] = useState<number | null>(null);
    const showOppModal = (index: number) => setOppModalVisible(index);
    const hideOppModal = () => setOppModalVisible(null);
    const containerStyle = {
        backgroundColor: "transparent",
        padding: 0,
        margin: 15,
        height: modalHeight,
    };

    const { colors, fonts } = useTheme();

    return (
        <Card
            style={[
                styles.card,
                {
                    backgroundColor: colors.primaryContainer,
                },
            ]}
        >
            <Card.Content style={styles.cardContent}>
                <Card.Title
                    titleVariant="titleLarge"
                    title={opp.businessName}
                    titleStyle={styles.cardTitle}
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                />
                <Text>{opp.description}</Text>
                {/* <Card.Cover style={styles.cardCover} source={{ uri: photoUrl || placeholderImage }} />
                <Card.Actions style={styles.cardActions}>
               <Button
                        labelStyle={{
                            fontFamily: "SpaceMono",
                            color: colors.onPrimary,
                        }}
                        style={{
                            backgroundColor: colors.primary,
                        }}
                        onPress={handlePress}
                    >
                        View Business
                    </Button> 
                </Card.Actions> */}
            </Card.Content>
        </Card>
    );
};

export default OpportunityCard;
