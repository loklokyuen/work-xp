import ChatButton from "@/components/chat/ChatButton";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
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
  const router = useRouter();
  let backgroundColor;
  if (expanded) {
    backgroundColor = colors.quarternary;
  } else if (application.isAccepted === true) {
    backgroundColor = colors.secondary;
  } else if (application.isAccepted === false) {
    backgroundColor = colors.error;
  } else {
    backgroundColor = "#F5CA6B"; // Orange (Pending)
  }
  function navigateToBusinessProfile() {
    router.push({pathname: "/explore/publicProfile", params: {uid: application.businessId}});
  }

  return (
    <View
      style={{
        padding: 5,
        margin: 10,
        borderRadius: 15,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      <List.Accordion
        key={application.uid}
        title={opportunity?.jobRole}
        titleStyle={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
          fontFamily: "Lato",
          color: expanded ? colors.surface : colors.tertiary,
        }}
        style={{ backgroundColor, borderRadius: 15 }}
        expanded={expanded}
        onPress={onPress}
      >
        <View style={{ alignItems: "center" }}>
          <Text onPress={navigateToBusinessProfile}
            style={{
              fontFamily: "Lato",
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
                  fontFamily: "Lato",
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
                  fontFamily: "Lato",
                  color: colors.tertiary,
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                {opportunity.description}
              </Text>
              <ChatButton
                receiverUid={application?.businessId || ""}
                receiverDisplayName={application?.businessName || ""}
                receiverAccountType="Business"
              />
            </>
          )}
          {application.isAccepted === true ? (
            <Card style={{ backgroundColor: colors.secondaryContainer, margin: 10 }}>
              <Card.Content>
                <Text
                  style={{
                    color: colors.onSecondary,
                    margin: 10,
                    fontFamily: "Lato",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  🎉 Congratulations! You have been accepted for this role.
                  Please chat with the business for further details.
                </Text>
              </Card.Content>
            </Card>
          ) : application.isAccepted === false ? (
            <Card style={{ backgroundColor: colors.errorContainer, margin: 10  }}>
              <Card.Content>
                <Text
                  style={{
                    color: colors.error,
                    padding: 10,
                    fontFamily: "Lato",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ❌ Unfortunately, your application was not successful. Please
                  explore and apply to other opportunities!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <Card style={{ backgroundColor: colors.surfaceVariant, margin: 10  }}>
              <Card.Content>
                <Text
                  style={{
                    color: colors.tertiary,
                    padding: 10,
                    fontFamily: "Lato",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ⏳ Your application is still under review. Please wait for a
                  response from the business.
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
