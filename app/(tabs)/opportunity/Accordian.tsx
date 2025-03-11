import { View, StyleSheet, Text } from "react-native";
import { List, useTheme, Card } from "react-native-paper";

interface Application {
  uid: string;
  businessName: string;
  isAccepted: boolean;
  businessId: string;
  oppId: string;
}

interface Opportunity {
  jobRole: string;
  description: string;
}

interface AccordionProps {
  application: Application;
  opportunity: Opportunity | null;
  expanded: boolean;
  onPress: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  application,
  opportunity,
  expanded,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={{ padding: 5, margin: 10 }}>
      <List.Accordion
        key={application.uid}
        title={opportunity?.jobRole}
        titleStyle={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
          fontFamily: "SpaceMono",
          color: expanded ? colors.surface : colors.tertiary,
        }}
        style={{
          backgroundColor: expanded
            ? colors.quarternary
            : application.isAccepted
            ? colors.secondary
            : "#F5CA6B",
        }}
        expanded={expanded}
        onPress={onPress}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "SpaceMono",
              color: colors.primary,
              marginTop: 20,
              marginBottom: 20,
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            {application?.businessName}, {opportunity?.jobRole}
          </Text>
          {opportunity && (
            <>
              <Text
                style={{
                  fontFamily: "SpaceMono",
                  color: colors.tertiary,
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: 15,
                }}
              >
                Job Description:
              </Text>
              <Text
                style={{
                  fontFamily: "SpaceMono",
                  color: colors.tertiary,
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                {opportunity.description}
              </Text>
            </>
          )}
          {application.isAccepted ? (
            <Card
              style={{
                backgroundColor: colors.secondaryContainer,
              }}
            >
              <Card.Content>
                <Text
                  style={{
                    color: colors.onSecondary,
                    padding: 5,
                    margin: 10,
                    fontFamily: "SpaceMono",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Congratulations, you have been accepted for this role! Please
                  chat with the business for further details.
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <Card style={{ backgroundColor: colors.errorContainer }}>
              <Card.Content>
                <Text
                  style={{
                    color: colors.error,
                    padding: 20,
                    fontFamily: "SpaceMono",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  You have not been accepted at this time, or your application
                  is still under review. Please chat with the business to check
                  on the status.
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </List.Accordion>
    </View>
  );
};

export default Accordion;
