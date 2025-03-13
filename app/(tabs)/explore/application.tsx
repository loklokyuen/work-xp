import { useUserContext } from "@/context/UserContext";

import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { getStudentById } from "@/database/student";

import { addApplication, checkApplicationExists } from "@/database/applications";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ConfirmationModal } from "@/modal/ConfirmationModal";
import { useRouter } from "expo-router";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getAvailabilitiesByBusinessIdOpportunityId, getBusinessById, getBusinessOpportunityById } from "@/database/business";
import { SnackbarContext } from "@/context/SnackbarProvider";

type DayPressEvent = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

export default function Application() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const { showSnackbar } = useContext(SnackbarContext);
  
  const { businessId, oppId, businessName } = useLocalSearchParams<{
    businessId: string;
    oppId: string;
    businessName: string;
  }>();

  const [jobRole, setJobRole] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  const [dates, setDates] = useState<Record<string, any>>({});
  const [why, setWhy] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const [subjects, setSubjects] = useState<string[]>([]);
  const [personalStatement, setPersonalStatement] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [chosen, setChosen] = useState<Record<string, any>>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [missingFields, setMissingFields] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const { colors, fonts } = useTheme();

  const BusinessId = businessId;
  const OpportunityId = oppId;

  useEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerTitle: "Application",
    });
  }, [navigation]);
  useEffect(() => {
    if (user?.uid) {
      getBusinessOpportunityById(BusinessId, OpportunityId).then((opp) => {
        if (opp) {
          setJobRole(opp.jobRole);
        }
      });
      getAvailabilitiesByBusinessIdOpportunityId(BusinessId, OpportunityId).then((availabilities) => {
        availabilities.forEach((availability) => {
          const period = availability.period;
          markDates(period, "blue");
        });
      });
      getBusinessById(BusinessId).then((business) => {
        if (business) {
          setCompanyName(business.displayName);
        }
      });
      getStudentById(user.uid).then((res) => {
        setDisplayName(res.displayName);
        setSubjects(res.subjects);
        setExperience(res.experience);
        setPersonalStatement(res.personalStatement);
        setPhotoUrl(res.photoUrl);
      });

      return () => {
        setDates({});
      };
    }
  }, [user?.uid]);

  const markDates = (period: string, color: string) => {
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

    setDates((prevDates) => ({ ...prevDates, ...markedDates }));
  };

  function chooseDates(period: string) {
    setChosen((prevChosen) => {
      if (prevChosen[period]) {
        const copy = { ...prevChosen };
        delete copy[period];
        return copy;
      } else {
        return { ...prevChosen, [period]: true };
      }
    });

    const start = period.split(":")[0];
    const end = period.split(":")[1];
    let current = new Date(start);
    let markedDates = { ...dates };

    while (current <= new Date(end)) {
      let dateAsString = current.toISOString().split("T")[0];
      markedDates[dateAsString].color === "blue"
        ? (markedDates[dateAsString] = {
            ...markedDates[dateAsString],
            color: "green",
          })
        : (markedDates[dateAsString] = {
            ...markedDates[dateAsString],
            color: "blue",
          });
      current.setDate(current.getDate() + 1);
    }
    setDates(markedDates);
  }

  function handleDay(day: string) {
    if (dates[day]) {
      chooseDates(dates[day].period);
    }
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  const handleSubmit = async () => {
    if (!why || !reason || Object.keys(chosen).length === 0) {
      setMissingFields(true);
      setTimeout(() => setMissingFields(false), 5000);
      // setErrorMessage("Please fill in all fields and select from available dates to proceed.");
      // setIsErrorModalVisible(true);
      showSnackbar("Please fill in all fields and select from available dates to proceed.", "error", 5000);
      return;
    }
    if (!user) return;
    try {
      const hasAppliedAlready = await checkApplicationExists(user.uid, OpportunityId);
      if (hasAppliedAlready) {
        setHasApplied(true);
        setTimeout(() => setHasApplied(false), 5000);
        // setErrorMessage("You have already applied for this opportunity! Please check on the status of your application or apply for another.");
        // setIsErrorModalVisible(true);
        showSnackbar("You have already applied for this opportunity! Please check on the status of your application or apply for another.", "error", 5000);
        return;
      }
      const data = {
        oppId: OpportunityId,
        businessId: BusinessId,
        datesApplied: Object.keys(chosen),
        studentId: user.uid,
        whyApply: why,
        whySuitable: reason,
        personalStatement: personalStatement,
        displayName: displayName,
        experience: experience,
        subjects: subjects,
        photoUrl: photoUrl,
        businessName: businessName,
      };

      await addApplication(
        data.oppId,
        data.businessId,
        data.datesApplied,
        data.studentId,
        data.whyApply,
        data.whySuitable,
        data.personalStatement,
        data.experience,
        data.subjects,
        data.displayName,
        data.photoUrl,
        data.businessName
      );

      setIsModalVisible(true);
      setMissingFields(false);
      setTimeout(() => {
        setIsModalVisible(false);
        router.back();
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.container}>
      <ConfirmationModal open={isErrorModalVisible} onClose={() => setIsErrorModalVisible(false)} title="Error" message={errorMessage} />

      {/* {hasApplied && (
        <Text
          style={{
            color: colors.error,
            textAlign: "center",
            marginBottom: 20,
            fontSize: 18,
            fontFamily: "Lato",
          }}
        >
          You have already applied for this opportunity! Please check on the
          status of your application or apply for another.
        </Text>
      )}

      {missingFields && (
        <Text
          style={{
            color: colors.error,
            textAlign: "center",
            marginBottom: 20,
            fontSize: 18,
            fontFamily: "Lato",
          }}
        >
          Please fill in all fields and select from available dates to proceed.
        </Text>
      )} */}
      <Text style={styles.title1}>
        {jobRole} at {companyName}
      </Text>
      <Text style={styles.title}>Select the dates you'd like to apply for</Text>
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
        markedDates={dates}
        setJobRole
        onDayPress={(day: DayPressEvent) => {
          handleDay(day.dateString);
        }}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Why do you want to apply for this role?
        </Text>
        <TextInput
          multiline
          style={[styles.input, { flexGrow: 1}]}
          value={why}
          onChangeText={setWhy}
          placeholder="I would like to apply for this role because..."
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Why should we pick you?</Text>
        <TextInput
          multiline
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder="I would make a strong candidate because..."
        />
      </View>
      <Text style={{ padding: 10, textAlign: "center", color: "grey"}}>Your profile will be sent to the business once you've submitted your application.</Text>
      <Button onPress={handleSubmit} mode="contained" style={[styles.button]} labelStyle={styles.buttonLabel}>Submit Application</Button>

      <ConfirmationModal
        open={isModalVisible}
        onClose={closeModal}
        title="Application Submitted!"
        message="Your application has been successfully submitted."
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 85,
  },
  title: {
    fontSize: 18,
    // fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  title1: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    margin: 5,
    fontSize: 16,
    minHeight: 40,
  },
  button: {
    marginTop: 12,
    borderRadius: 8, 
    paddingLeft: 5,
    paddingRight: 5,
  },
  buttonLabel: {
    fontFamily: "Lato",
    fontSize: 16,
    fontWeight: "normal",
  },
});
