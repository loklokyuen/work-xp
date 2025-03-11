import { Text, StyleSheet } from "react-native";
import { useTheme, Button, Card } from "react-native-paper";

interface ApplicationCardProps {
  application: Application1;
  onDecision: (uid: string, accepted: boolean) => void;
}

const ApplicationCard = ({ application, onDecision }: ApplicationCardProps) => {
  const { colors, fonts } = useTheme();

  const handleDecision = async (accepted: boolean) => {
    try {
      await onDecision(application.uid, accepted);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  return (
    <Card
      style={{
        margin: 20,
        backgroundColor: colors.primaryContainer,
        alignContent: "center",
      }}
    >
      <Card.Content style={{ alignItems: "center" }}>
        {/* Username */}
        <Text
          style={{
            fontFamily: "SpaceMono",
            color: colors.primary,
            fontSize: 20,
            fontWeight: "bold",
            paddingBottom: 20,
          }}
        >
          Student Username: {application.displayName}
        </Text>

        {/* Image */}
        <Card.Cover
          style={styles.cardCover}
          source={{ uri: application.photoUrl }}
        />

        {/* Why they applied */}
        <Text
          style={{
            fontFamily: "SpaceMono",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Why they applied:
        </Text>
        <Text style={{ fontFamily: "SpaceMono" }}>{application.whyApply}</Text>

        {/* Why they are suitable */}
        <Text
          style={{
            fontFamily: "SpaceMono",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Why they're suitable:
        </Text>
        <Text style={{ fontFamily: "SpaceMono" }}>
          {application.whySuitable}
        </Text>

        {/* Chosen subjects */}
        <Text
          style={{
            fontFamily: "SpaceMono",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Chosen subjects:
        </Text>
        <Text style={{ fontFamily: "SpaceMono" }}>{application.subjects}</Text>

        {/* Previous experience */}
        <Text
          style={{
            fontFamily: "SpaceMono",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Previous experience:
        </Text>
        <Text style={{ fontFamily: "SpaceMono" }}>
          {application.experience}
        </Text>

        {/* Dates applied for */}
        <Text
          style={{
            fontFamily: "SpaceMono",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Dates applied for:
        </Text>
        <Text style={{ fontFamily: "SpaceMono" }}>
          {application.datesApplied.join(", ")}
        </Text>

        {/* Buttiins */}
        <Button
          labelStyle={{
            fontFamily: "SpaceMono",
            color: colors.tertiary,
          }}
          style={{
            backgroundColor: colors.secondary,
            margin: 5,
          }}
          mode="contained"
          onPress={() => handleDecision(true)}
        >
          Accept application
        </Button>

        <Button
          labelStyle={{
            fontFamily: "SpaceMono",
            color: colors.onPrimary,
          }}
          style={{
            backgroundColor: colors.error,
            margin: 10,
          }}
          mode="contained"
          onPress={() => handleDecision(false)}
        >
          Decline application
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardCover: {
    width: "100%",
    height: 200,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "SpaceMono",
  },
  bold: {
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default ApplicationCard;
