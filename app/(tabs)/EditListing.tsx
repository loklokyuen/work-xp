import { useUserContext } from "@/context/UserContext";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import CalendarBusinessEdit from "../../components/Calendar/CalendarBusinessEdit";
import { db } from "../../database/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";

interface OpportunityCardProps {
  Availability: string;
  Description: string;
  JobRole: string;
}

interface Opportunity {
  "Job role": string;
  Description: string;
  Availability: string;
}

export default function EditListing() {
  const { Availability, Description, JobRole } =
    useLocalSearchParams<OpportunityCardProps>();
  const router = useRouter();

  const { user, setUser } = useUserContext();
  const [jobRole, setJobRole] = useState<string>(JobRole);
  const [availability, setAvailability] = useState<string>(Availability);
  const [description, setDescription] = useState<string>(Description);
  const [oppToRemove, setOppToRemove] = useState({});
  console.log(JobRole, Description, Availability);
  const handleSubmit = async () => {
    if (!jobRole || !description || !availability) {
      alert("please fill in all fields");
    } else {
      alert("form submitted succesfully");
    }

    const docRef = doc(db, "Business", user.uid);
    console.log(docRef);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const opportunitiesArray = data.Opportunities;

        const singleOpp = opportunitiesArray.find(
          (opportunity: OpportunityCardProps) =>
            opportunity.Availability === Availability
        );
        if (singleOpp) {
          setOppToRemove(singleOpp);

          await updateDoc(docRef, {
            Opportunities: arrayRemove(singleOpp),
          });
        }

        await updateDoc(docRef, {
          Opportunities: arrayUnion({
            "Job role": jobRole,
            Description: description,
            Availability: availability,
          }),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setJobRole(JobRole);
    setAvailability(Availability);
    setDescription(Description);
  }, [JobRole, Availability, Description]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit this Opportunity...</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edit job role..</Text>
        <TextInput
          style={styles.input}
          value={jobRole}
          onChangeText={setJobRole}
          placeholder="The job role is.."
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edit description of the role..</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="The opportunity involves.."
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New dates for this opportunity..</Text>
        <CalendarBusinessEdit
          setAvailability={setAvailability}
          confirmedAvailability={Availability}
        ></CalendarBusinessEdit>
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
