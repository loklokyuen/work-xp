import { useUserContext } from "@/context/UserContext";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Chip } from "react-native-paper";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { router, Redirect, useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "react-native-paper";

type DayPressEvent = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

export default function Listing() {
  const navigation = useNavigation();
  const { user, accountType } = useUserContext();
  const { listingId } = useLocalSearchParams<Record<string, string>>();

  const [jobRole, setJobRole] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [firstDay, setFirstDay] = useState<string>("");

  const [dates, setDates] = useState<Record<string, any>>({});
  const [periods, setPeriods] = useState<Record<string, any>>({});
  const [remove, setRemove] = useState<string[]>([]);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState<string>("");

  const { colors, fonts } = useTheme();

  if (accountType === "Student") {
    return <Redirect href="/+not-found" />;
  }

  useEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerTitle: "Listing",
    });
  }, [navigation]);

  useEffect(() => {
    if (user?.uid) {
      if (listingId) {
        getDoc(doc(db, "Business", user.uid, "Opportunities", listingId)).then(
          (result) => {
            const data = result.data();
            if (data) {
              setJobRole(data.jobRole);
              setDescription(data.description);
              setSubjects(data.subjects || []);
            }
          }
        );
        getDocs(
          collection(
            db,
            "Business",
            user.uid,
            "Opportunities",
            listingId,
            "Availabilities"
          )
        ).then((result) => {
          result.docs.forEach((doc) => {
            const period = doc.data().period;
            markDates(period, doc.id, "red");
          });
        });
        return () => {
          // unsubscribe1();
          // unsubscribe2();
          // setDates({});
          // setPeriods({});
        };
      }
    }
  }, [user?.uid, listingId]);

  const handleDeleteSubject = (subject: string) => {
    const newSubjects = subjects.filter((s) => s !== subject);
    setSubjects(newSubjects);
  };

  const markDates = (period: string, id: string, color: string) => {
    let markedDates: Record<string, any> = {};

    const [start, end] = period.split(":");
    let current = new Date(start);

    while (current <= new Date(end)) {
      let dateAsString = current.toISOString().split("T")[0];
      if (dates[dateAsString]) return;
      markedDates[dateAsString] = {
        color: color,
        textColor: "white",
        startingDay: dateAsString === start,
        endingDay: dateAsString === end,
        period: period,
      };
      current.setDate(current.getDate() + 1);
    }

    setPeriods((prevPeriods) => ({ ...prevPeriods, [period]: id }));
    setDates((prevDates) => ({ ...prevDates, ...markedDates }));
  };

  const unMarkDates = (period: string) => {
    const [start, end] = period.split(":");
    let current = new Date(start);

    if (periods[period]) {
      setRemove((prevRemove) => [...prevRemove, periods[period]]);
    }

    setPeriods((prevPeriods) => {
      const newPeriods = { ...prevPeriods };
      delete newPeriods[period];
      return newPeriods;
    });

    const newDates = { ...dates };
    while (current <= new Date(end)) {
      let dateAsString = current.toISOString().split("T")[0];
      delete newDates[dateAsString];
      current.setDate(current.getDate() + 1);
    }
    setDates(newDates);
  };

  function handleDay(day: string) {
    if (!dates[day]) {
      if (!firstDay || new Date(firstDay) > new Date(day)) {
        setFirstDay(day);
      } else if (new Date(firstDay) <= new Date(day)) {
        markDates(firstDay + ":" + day, "", "green");
        setFirstDay("");
      }
    } else {
      if (firstDay) {
        setFirstDay("");
      } else {
        unMarkDates(dates[day].period);
      }
    }
  }

  const handleSubmit = async () => {
    if (
      (Object.keys(periods).length || remove.length) &&
      jobRole &&
      description
    ) {
      try {
        if (!user) return;
        const document = {
          jobRole: jobRole,
          description: description,
          subjects: subjects,
        };
        if (listingId) {
          await updateDoc(doc(db, "Opportunities", listingId), document);
          await updateDoc(
            doc(db, "Business", user.uid, "Opportunities", listingId),
            document
          );
          for (let id of remove) {
            await deleteDoc(
              doc(
                db,
                "Business",
                user.uid,
                "Opportunities",
                listingId,
                "Availabilities",
                id
              )
            );
          }
          for (let period in periods) {
            if (!periods[period]) {
              await addDoc(
                collection(
                  db,
                  "Business",
                  user.uid,
                  "Opportunities",
                  listingId,
                  "Availabilities"
                ),
                {
                  period: period,
                }
              );
            }
          }
        } else {
          addDoc(collection(db, "Opportunities"), document);
          const opp = await addDoc(
            collection(db, "Business", user.uid, "Opportunities"),
            document
          );
          for (let period in periods) {
            await addDoc(
              collection(
                db,
                "Business",
                user.uid,
                "Opportunities",
                opp.id,
                "Availabilities"
              ),
              {
                period: period,
              }
            );
          }
        }
        router.back();
        // setDates({});
        // setPeriods([]);
        // setJobRole("");
        // setDescription("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {listingId ? (
        <Text style={styles.title}>Edit an Opportunity...</Text>
      ) : (
        <Text style={styles.title}>Post an Opportunity...</Text>
      )}

      <View style={styles.inputContainer}>
        {listingId ? (
          <Text style={styles.label}>Edit the job role</Text>
        ) : (
          <Text style={styles.label}>What is the job role?</Text>
        )}
        <TextInput
          style={styles.input}
          value={jobRole}
          onChangeText={setJobRole}
          placeholder="The job role is.."
        />
      </View>

      <View style={styles.inputContainer}>
        {listingId ? (
          <Text style={styles.label}>Edit the description</Text>
        ) : (
          <Text style={styles.label}>What is the description?</Text>
        )}
        <TextInput
          multiline
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="The opportunity involves.."
        />
      </View>
      <Text variant="titleSmall" style={{ marginHorizontal: 20 }}>
        Related Subjects (optional):
      </Text>

      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 10 }}
      >
        {subjects.map((subject) => {
          return (
            <Chip
              key={subject}
              style={{ margin: 3 }}
              closeIcon="close"
              onClose={() => {
                handleDeleteSubject(subject);
              }}
            >
              {subject}
            </Chip>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // flexWrap: "wrap",
          marginHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <TextInput
          style={{ margin: 5, width: "70%", height: 40 }}
          dense
          label="Add a subject"
          mode="outlined"
          value={newSubject}
          onChangeText={(text) => {
            setNewSubject(text);
          }}
        />
        <Button
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 40,
            justifyContent: "center",
          }}
          labelStyle={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.tertiary,
          }}
          mode="contained-tonal"
          // mode="outlined"
          onPress={() => {
            setSubjects([...subjects, newSubject]);
            setNewSubject("");
          }}
        >
          Add
        </Button>
      </View>
      <View style={styles.inputContainer}>
        {listingId ? (
          <Text style={styles.label}>
            What are the new dates for this opportunity
          </Text>
        ) : (
          <Text style={styles.label}>
            What dates would like to advertise the opportunity?
          </Text>
        )}
        <Calendar
          style={{
            borderWidth: 1,
            borderColor: "gray",
            height: 400,
          }}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#dd99ee",
          }}
          markingType={"period"}
          markedDates={{
            [firstDay]: {
              color: "green",
              textColor: "white",
              startingDay: true,
            },
            ...dates,
          }}
          onDayPress={(day: DayPressEvent) => handleDay(day.dateString)}
        />
      </View>

      <Button mode="contained" onPress={handleSubmit}>
        Submit
      </Button>
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
    padding: 2,
    fontSize: 16,
    minHeight: 40,
  },
});
