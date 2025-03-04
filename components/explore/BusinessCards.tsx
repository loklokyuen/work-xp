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
      <Card.Title titleVariant="titleLarge" title={displayName} />
      <Card.Content>
        <Text variant="bodyMedium">{location}</Text>
      </Card.Content>
      <Card.Cover style={styles.cardCover} source={{ uri: photoUrl }} />
      <Card.Actions>
        <Button>View Business</Button>
      </Card.Actions>
    </Card>
  );
};
export default BusinessCards;
