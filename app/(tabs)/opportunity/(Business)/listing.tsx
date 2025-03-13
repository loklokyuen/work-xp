import { useUserContext } from "@/context/UserContext";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Chip, Card } from "react-native-paper";
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
import { useEffect, useState, useContext } from "react";
import { Calendar } from "react-native-calendars";
import { router, Redirect, useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  addAvailability,
  addBusinessOpportunity,
  deleteAvailability,
  getAvailabilitiesByBusinessIdOpportunityId,
  getBusinessOpportunityById,
  updateBusinessOpportunity,
} from "@/database/business";
import { addOpportunity, updateOpportunity } from "@/database/opportunities";
import { SnackbarContext } from "@/context/SnackbarProvider";

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
  const { showSnackbar } = useContext(SnackbarContext);
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
        getBusinessOpportunityById(user.uid, listingId).then((opportunity) => {
          if (opportunity) {
            setJobRole(opportunity.jobRole);
            setDescription(opportunity.description);
            setSubjects(opportunity.subjects || []);
          }
        });
        getAvailabilitiesByBusinessIdOpportunityId(user.uid, listingId).then(
          (availabilities) => {
            availabilities.forEach((availability) => {
              const period = availability.period;
              markDates(period, availability.id, "red");
            });
          }
        );
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
        color: colors.secondary,
        textColor: colors.tertiary,
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
          await updateOpportunity(listingId, jobRole, description, subjects);
          await updateBusinessOpportunity(
            user.uid,
            listingId,
            jobRole,
            description,
            subjects
          );
          for (let id of remove) {
            await deleteAvailability(user.uid, listingId, id);
          }
          for (let period in periods) {
            if (!periods[period]) {
              await addAvailability(user.uid, listingId, { period: period });
            }
          }
          showSnackbar("Opportunity successfully updated!", "success", 5000);
        } else {
          const opp = await addBusinessOpportunity(
            user.uid,
            jobRole,
            description,
            subjects
          );
          await addOpportunity(
            opp?.id || "",
            user.uid,
            user.displayName,
            jobRole,
            description,
            subjects
          );
          for (let period in periods) {
            await addAvailability(user.uid, opp?.id || "", { period: period });
          }
          showSnackbar("Opportunity successfully posted!", "success", 5000);
        }
        router.back();
        // setDates({});
        // setPeriods([]);
        // setJobRole("");
        // setDescription("");
      } catch (err) {
        if (listingId) {
          showSnackbar("Error updating opportunity", "error", 5000);
        } else {
          showSnackbar("Error posting opportunity", "error", 5000);
        }
        // console.log(err);
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {listingId ? (
          <Text
            variant="titleLarge"
            style={[
              styles.title,
              {
                color: colors.onSecondary,
                fontFamily: "Lato",
              },
            ]}
          >
            Edit an Opportunity
          </Text>
        ) : (
          <Text
            style={[
              styles.title,
              {
                color: colors.onSecondary,
                fontFamily: "Lato",
                fontWeight: "bold",
              },
            ]}
          >
            Post an Opportunity
          </Text>
        )}
        <Card
          style={{
            backgroundColor: colors.secondaryContainer,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <View style={styles.inputContainer}>
            {listingId ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.onSecondary,
                    fontFamily: "Lato",
                    paddingTop: 10,
                  },
                ]}
              >
                Edit the job role
              </Text>
            ) : (
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.onSecondary,
                    fontFamily: "Lato",
                    paddingTop: 10,
                  },
                ]}
              >
                What is the job role?
              </Text>
            )}
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.onPrimary,
                  fontFamily: "Lato",
                },
              ]}
              value={jobRole}
              onChangeText={setJobRole}
              placeholder="The job role is.."
            />
          </View>

          <View style={styles.inputContainer}>
            {listingId ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.onSecondary,
                    fontFamily: "Lato",
                  },
                ]}
              >
                Edit the description
              </Text>
            ) : (
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.onSecondary,
                    fontFamily: "Lato",
                  },
                ]}
              >
                What is the description?
              </Text>
            )}
            <TextInput
              multiline
              style={[
                styles.input,
                {
                  backgroundColor: colors.onPrimary,
                  fontFamily: "Lato",
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="The opportunity involves.."
            />
          </View>

          <Text
            variant="titleSmall"
            style={[
              {
                marginHorizontal: 20,
                color: colors.onSecondary,
                fontFamily: "Lato",
              },
            ]}
          >
            Related Subjects (optional):
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: 10,
            }}
          >
            {subjects.map((subject) => {
              return (
                <Chip
                  key={subject}
                  style={{
                    margin: 3,
                    backgroundColor: colors.secondary, // Chip background color
                  }}
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
              marginHorizontal: 10,
              justifyContent: "center",
            }}
          >
            <TextInput
              style={{
                margin: 5,
                width: "70%",
                height: 40,
                backgroundColor: colors.onPrimary,
                fontFamily: "Lato",
              }}
              dense
              label="Add a subject"
              contentStyle={{ fontFamily: "Lato" }}
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
              onPress={() => {
                if (newSubject.trim() === "") return;
                setSubjects([...subjects, newSubject]);
                setNewSubject("");
              }}
            >
              Add
            </Button>
          </View>

          <View style={styles.inputContainer}>
            {listingId ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.onSecondary,
                    fontFamily: "Lato",
                    paddingBottom: 20,
                    paddingTop: 20,
                  },
                ]}
              >
                What are the new dates for this opportunity?
              </Text>
            ) : (
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.onSecondary,
                    fontFamily: "Lato",
                    paddingTop: 20,
                    paddingBottom: 20,
                    textAlign: "center",
                  },
                ]}
              >
                What dates would like to advertise the opportunity?
              </Text>
            )}
            <Calendar
              style={{
                borderWidth: 0,
                height: 400,
                backgroundColor: colors.tertiaryContainer,
              }}
              theme={{
                calendarBackground: colors.tertiaryContainer,
                textSectionTitleColor: colors.primary,
                todayTextColor: colors.quarternary,
                dayTextColor: colors.tertiary,
                textDisabledColor: "#dd99ee",
                textDayFontFamily: "Lato",
                textMonthFontFamily: "Lato",
                textDayHeaderFontFamily: "Lato",
                monthTextColor: colors.primary,
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
        </Card>
      </View>
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colors.secondary,
          },
        ]}
        labelStyle={{ color: colors.tertiary }}
      >
        Submit
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    // backgroundColor: "#fff",
    marginHorizontal: 16,
  },
  card: {
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
  },
  inputContainer: {
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    alignSelf: "center",
    paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
    fontSize: 16,
    minHeight: 40,
  },
  buttonContainer: {
    justifyContent: "space-evenly",
    width: "50%",
    alignSelf: "center",
    marginBottom: 20,
  },
});
