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
        }}
        style={
          application.isAccepted
            ? { backgroundColor: colors.secondary }
            : { backgroundColor: "#F5CA6B" }
        }
        expanded={expanded}
        onPress={onPress}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "SpaceMono",
              color: colors.primary,
              padding: 20,
              fontWeight: "bold",
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
                }}
              >
                Job Description:
              </Text>
              <Text
                style={{
                  fontFamily: "SpaceMono",
                  color: colors.tertiary,
                  padding: 10,
                }}
              >
                {opportunity.description}
              </Text>
            </>
          )}
          {application.isAccepted ? (
            <Card style={{ backgroundColor: colors.secondaryContainer }}>
              <Card.Content>
                <Text
                  style={{
                    color: colors.onSecondary,
                    padding: 20,
                    fontFamily: "SpaceMono",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Congratulations, you have been accepted for this role!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <Card style={{ backgroundColor: colors.tertiaryContainer }}>
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
