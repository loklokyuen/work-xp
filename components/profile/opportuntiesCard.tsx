import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import {
  Banner,
  Button,
  Modal,
  PaperProvider,
  Portal,
} from "react-native-paper";

interface OpportunityInfoProps {
  availability: string;
  description: string;
  jobRole: string;
}

// TEST DATA
const aOpportunity: OpportunityInfoProps[] = [
  {
    availability: "April - May",
    description:
      "Exciting role for a junior mechanic to join our team for work experience!",
    jobRole: "Mechanic Assistant",
  },
  {
    availability: "June",
    description: "Join our customer service team!",
    jobRole: "Recptionist Assistant",
  },
];

const OpportunityCards: React.FC<OpportunityInfoProps> = ({
  availability,
  description,
  jobRole,
}) => {
  const [oppModalvisible, setOppModalVisible] = useState(false);
  const showOppModal = () => setOppModalVisible(true);
  const hideOppModal = () => setOppModalVisible(false);

 const screenHeight = Dimensions.get("window").height;
 const modalHeight = screenHeight * 0.2; 

  const containerStyle = { backgroundColor: "transparent", padding: 0, margin: 20,  height: modalHeight,
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={oppModalvisible}
          onDismiss={hideOppModal}
          contentContainerStyle={containerStyle}
        >
            <View style={styles.modalView}>
              <Text style={styles.text}>{aOpportunity[0].description}</Text>
              <Text style={styles.text}>
                Availability: {aOpportunity[0].availability}
              </Text>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Apply</Text>
              </Pressable>
            </View>
        </Modal>
      </Portal>

      <Button style={{ marginTop: 50 }} onPress={showOppModal}>
        View {aOpportunity[0].jobRole}
      </Button>
    </PaperProvider>
  );
};
export default OpportunityCards;

const styles = StyleSheet.create({
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
  button: {
    borderRadius: 20,
    backgroundColor: '#795663',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 15,
  },
  textOnWhite: {
    color: "black",
    textAlign: "center",
    paddingBottom: 10,
  },
});
