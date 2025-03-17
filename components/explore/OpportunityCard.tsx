import { Button, Card, Text, useTheme } from "react-native-paper";
import styles from "@/app/styles"; // Assuming the styles are similar to those used in BusinessCards
import { router } from "expo-router";
import { View } from "react-native";

interface OpportunityInfoProps {
  id: string;
  jobRole: string;
  description: string;
  businessName: string;
  business: {
    uid: string;
    displayName: string;
    county: string;
    photoUrl: string;
  };
}

const OpportunityCard = ({ opp }: { opp: OpportunityInfoProps }) => {
  const { colors } = useTheme();

  const businessPhotoUrl = opp.business ? opp.business.photoUrl : null;
  const placeholderImage =
    "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651936/samples/cup-on-a-table.jpg";

  const imageSource = businessPhotoUrl
    ? { uri: businessPhotoUrl }
    : { uri: placeholderImage };

  const handlePress = () => {
    router.push({
      pathname: "/explore/publicProfile",
      params: { uid: opp.business.uid },
    });
  };

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
        <Text style={styles.text} variant="bodyMedium">
          {opp.jobRole}
        </Text>
        <Text style={styles.text} variant="bodySmall">
          {opp.description}
        </Text>

        <Card.Cover style={styles.cardCover} source={imageSource} />
        <Card.Actions style={styles.cardActions}>
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
            mode="contained-tonal"
            onPress={handlePress}
          >
            Apply for Opportunities
          </Button>
        </Card.Actions>
      </Card.Content>
    </Card>
  );
};

export default OpportunityCard;
