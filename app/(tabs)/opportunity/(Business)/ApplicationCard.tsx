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
            fontFamily: "Lato",
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
            fontFamily: "Lato",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
            paddingBottom: 6,
            paddingTop: 6,
          }}
        >
          Why they applied:
        </Text>
        <Text style={{ fontFamily: "Lato" }}>{application.whyApply}</Text>

        {/* Why they are suitable */}
        <Text
          style={{
            fontFamily: "Lato",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
            paddingBottom: 6,
            paddingTop: 6,
          }}
        >
          Why they're suitable:
        </Text>
        <Text style={{ fontFamily: "Lato" }}>{application.whySuitable}</Text>

        {/* Chosen subjects */}
        <Text
          style={{
            fontFamily: "Lato",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
            paddingBottom: 6,
            paddingTop: 6,
          }}
        >
          Chosen subjects:
        </Text>
        <Text style={{ fontFamily: "Lato" }}>{application.subjects}</Text>

        {/* Previous experience */}
        <Text
          style={{
            fontFamily: "Lato",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
            paddingBottom: 6,
            paddingTop: 6,
          }}
        >
          Previous experience:
        </Text>
        <Text style={{ fontFamily: "Lato" }}>{application.experience}</Text>

        {/* Dates applied for */}
        <Text
          style={{
            fontFamily: "Lato",
            color: colors.primary,
            fontSize: 15,
            fontWeight: "bold",
            paddingBottom: 6,
            paddingTop: 6,
          }}
        >
          Dates applied for:
        </Text>
        <Text style={{ fontFamily: "Lato" }}>
          {application.datesApplied.join(", ")}
        </Text>

        {/* Buttiins */}
        <Button
          labelStyle={{
            fontFamily: "Lato",
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
            fontFamily: "Lato",
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
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "Lato",
    paddingBottom: 12,
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
