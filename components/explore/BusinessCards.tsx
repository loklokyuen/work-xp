import { Button, Card, Text, useTheme } from "react-native-paper";
import styles from "@/app/styles";
import { router } from "expo-router";

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
  // uses uid from BusienssList map to pass uid to button here to pass to publicProfile to render a buisness profile!
  const placeholderImage =
    "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651936/samples/cup-on-a-table.jpg";
  const handlePress = () => {
    router.push({
      pathname: "/explore/publicProfile",
      params: { uid: uid },
    });
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
          title={displayName}
          titleStyle={styles.cardTitle}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        />

        <Text style={styles.text} variant="bodyMedium">
          {county}
        </Text>

        <Card.Cover
          style={styles.cardCover}
          source={{ uri: photoUrl || placeholderImage }}
        />
        <Card.Actions style={styles.cardActions}>
          <Button
            labelStyle={{
              fontFamily: "Lato",
              color: colors.onPrimary,
            }}
            style={{
              backgroundColor: colors.primary,
            }}
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
