import { useState, useContext } from "react";
// import styles from "../styles";
import { useUserContext } from "@/context/UserContext";
import BusinessCalenderPost from "@/components/Calendar/CalendarBusinessPost";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/database/firebase";

export default function PostOpportunity() {
  const [jobRole, setJobRole] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { user, setUser } = useUserContext();
  const [refresh, setRefresh] = useState<number>(0);

  const handleSubmit = async () => {
    if (!jobRole || !description || !availability) {
      alert("please fill in all fields");
    } else {
      alert("form submitted succesfully");
    }

    const docRef = doc(db, "Business", user.uid);

    await updateDoc(docRef, {
      Opportunities: arrayUnion({
        "Job role": jobRole,
        Description: description,

        Availability: availability,
      }),
    });
    setRefresh((prev) => prev + 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post an Opportunity...</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>What is the job role?</Text>
        <TextInput
          style={styles.input}
          value={jobRole}
          onChangeText={setJobRole}
          placeholder="The job role is.."
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Give a detailed description of the role?
        </Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="The opportunity involves.."
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          What dates would like to advertise the opportunity?
        </Text>
        <BusinessCalenderPost
          setAvailability={setAvailability}
        ></BusinessCalenderPost>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Chosen dates: {availability}</Text>
      </View>

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 40,
  },
});
