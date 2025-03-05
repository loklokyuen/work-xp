import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import styles from "@/app/styles";

interface BusinessInfoProps {
  displayName: string;
  location: string;
  photoUrl: string;
}

const BusinessCards: React.FC<BusinessInfoProps> = ({
  displayName,
  location,
  photoUrl,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Card.Title
          titleVariant="titleLarge"
          title={displayName}
          titleStyle={styles.cardTitle}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        />

        <Text style={styles.text} variant="bodyMedium">
          {location}
        </Text>

        <Card.Cover style={styles.cardCover} source={{ uri: photoUrl }} />

        <Card.Actions style={styles.cardActions}>
          <Button style={{ backgroundColor: "#795663" }} textColor="#FFFAFF">
            View Business
          </Button>
        </Card.Actions>
      </Card.Content>
    </Card>
  );
};
export default BusinessCards;
