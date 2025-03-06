import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Button,
  Modal,
  PaperProvider,
  Portal,
} from "react-native-paper";

interface Opportunity {
  id: string;
  availability: string[];
  description: string;
  jobRole: string;
}

// TEST DATA
const aOpportunity: Opportunity[] = [
  {
    id: "1",
    availability: ["April - May"],
    description:
      "Exciting role for a junior mechanic to join our team for work experience!",
    jobRole: "Mechanic Assistant",
  },
  {
    id: "2",
    availability: ["June"],
    description: "Join our customer service team!",
    jobRole: "Receptionist Assistant",
  },
];

const OpportunityCards: React.FC = () => {
  const screenHeight = Dimensions.get("window").height;
  const modalHeight = screenHeight * 0.2;

  // modal states
  const [oppModalvisible, setOppModalVisible] = useState<number | null>(null);
  const showOppModal = (index: number) => setOppModalVisible(index);
  const hideOppModal = () => setOppModalVisible(null);
  const containerStyle = {
    backgroundColor: "transparent",
    padding: 0,
    margin: 20,
    height: modalHeight,
  };

  // when the opportunities array is empty, loads alternate message
  if (aOpportunity.length === 0) {
    return (
      <Text style={styles.text}>
        Sorry, we don't have any work experience opportunities available yet! Check back again soon 🤞
      </Text>
    );
  }

  return (
    <PaperProvider>
      {/* map over opportunity array and push results into modals */}
      <View style={styles.container}>
        {aOpportunity.map((opp, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.text}></Text>
            <Button
              style={styles.oppButtons}
              textColor="#FFFAFF"
              onPress={() => showOppModal(index)}
            >
              {opp.jobRole}
            </Button>

            <Portal>
              <Modal
                visible={oppModalvisible === index}
                onDismiss={hideOppModal}
                contentContainerStyle={containerStyle}
              >
                <View style={styles.modalView}>
                  <Text style={styles.subtitle}>{opp.jobRole}</Text>
                  <Text style={styles.text}>{opp.description}</Text>
                  <Text style={styles.text}>
                    Availability: {opp.availability}
                  </Text>
                  <Button style={styles.applyButton} textColor="#FFFAFF">
                    {/* onPress={() => handleApply!} needed */}
                    Apply
                  </Button>
                  <Button onPress={hideOppModal} textColor="#3E92CC">
                    Close
                  </Button>
                </View>
              </Modal>
            </Portal>
          </View>
        ))}
      </View>
    </PaperProvider>
  );
};

export default OpportunityCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  card: {
    marginBottom: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  oppButtons: {
    textAlign: "center",
    backgroundColor: "#795663",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 2,
  },
  applyButton: {
    textAlign: "center",
    backgroundColor: "#795663",
    borderRadius: 20,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: 15,
    fontSize: 18,
  },
  text: {
    textAlign: "center",
    paddingBottom: 15,
    fontSize: 15,
  },
  textOnWhite: {
    color: "black",
    textAlign: "center",
    paddingBottom: 10,
  },
});
