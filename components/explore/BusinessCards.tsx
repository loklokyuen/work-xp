import * as React from "react";
import { Button, Card, Text, useTheme } from "react-native-paper";
import styles from "@/app/styles";
import { useRouter } from "expo-router";

interface BusinessInfoProps {
  uid: string;
  displayName: string;
  county: string;
  photoUrl: string;
}

const BusinessCards = ({
  uid,
  displayName,
  county,
  photoUrl,
}: BusinessInfoProps) => {
  // uses uid from BusienssList map to pass uid to button here to pass to publicProfile to render a buisness profile!]
  const { colors, fonts } = useTheme();
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: "/business/publicProfile",
      params: { uid: uid },
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Card.Title
          titleVariant="titleLarge"
          title={displayName}
          titleStyle={[styles.cardTitle, { color: colors.primary }]}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        />

        <Text style={styles.text} variant="bodyMedium">
          {county}
        </Text>

        <Card.Cover style={styles.cardCover} source={{ uri: photoUrl }} />
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            buttonColor={colors.tertiary}
            textColor={colors.onPrimary}
            labelStyle={{ ...fonts.bodyMedium }}
            onPress={handlePress}
          >
            View Business
          </Button>
        </Card.Actions>
      </Card.Content>
    </Card>
  );
};
export default BusinessCards;
