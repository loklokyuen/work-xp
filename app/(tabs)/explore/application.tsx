import { useUserContext } from "@/context/UserContext";

import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../database/firebase";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";

import { addApplication } from "@/database/applications";
import { useLocalSearchParams } from "expo-router";

type DayPressEvent = {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
};

export default function Application() {
    const { user } = useUserContext();
    const { businessId, oppId } = useLocalSearchParams<{
        businessId: string;
        oppId: string;
    }>();

    const [jobRole, setJobRole] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");

    const [dates, setDates] = useState<Record<string, any>>({});
    const [why, setWhy] = useState<string>("");
    const [reason, setReason] = useState<string>("");

    const [chosen, setChosen] = useState<Record<string, any>>({});

    const BusinessId = businessId;
    const OpportunityId = oppId;

    useEffect(() => {
        if (user?.uid) {
            getDoc(doc(db, "Business", BusinessId, "Opportunities", OpportunityId)).then((result) => {
                const data = result.data();
                if (data) {
                    setJobRole(data.jobRole);
                }
            });
            getDocs(collection(db, "Business", BusinessId, "Opportunities", OpportunityId, "Availabilities")).then((result) => {
                result.docs.forEach((doc) => {
                    const period = doc.data().period;
                    markDates(period, "blue");
                });
            });
            getDoc(doc(db, "Business", BusinessId)).then((result) => {
                const data = result.data();
                if (data) {
                    setCompanyName(data.displayName);
                }
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

    const handleSubmit = async () => {
        if (why && reason && chosen) {
            await addApplication(OpportunityId, BusinessId, user.uid, Object.keys(chosen), why, reason);
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title1}>
                {jobRole} at {companyName}{" "}
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
                <Text style={styles.label}>Why do you want to do work experience with us?</Text>
                <TextInput style={styles.input} value={why} onChangeText={setWhy} placeholder="I would like to apply for this role because..." />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Why should we pick you?</Text>
                <TextInput style={styles.input} value={reason} onChangeText={setReason} placeholder="I would make a strong candidate because..." />
            </View>

            <Button title="Submit Application" onPress={handleSubmit} />
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
        // fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    title1: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        marginTop: 10,
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
