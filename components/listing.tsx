import { useUserContext } from "@/context/UserContext";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { addDoc, collection, getDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";

//to fix:
//bug when pressing twice on same date
//bug when highlighting over period that is already highlighted - this probably should not be allowed.

type DayPressEvent = {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
};

export default function Listing({ listingId }: { listingId: string }) {
    const { user } = useUserContext();

    const [jobRole, setJobRole] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [firstDay, setFirstDay] = useState<string>("");

    const [dates, setDates] = useState<Record<string, any>>({});
    const [periods, setPeriods] = useState<string[]>([]);
    const [remove, setRemove] = useState<string[]>([]);

    useEffect(() => {
        if (user?.uid) {
            if (listingId) {
                const unsubscribe1 = onSnapshot(doc(db, "Business", user.uid, "Opportunities", listingId), (snapshot) => {
                    const data = snapshot.data();
                    if (data) {
                        setJobRole(data.jobRole);
                        setDescription(data.description);
                    }
                });
                const unsubscribe2 = onSnapshot(collection(db, "Business", user.uid, "Opportunities", listingId, "Availabilities"), (snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        console.log(doc.id);
                        const period = doc.data().period;
                        markDates(period[0], period[1], "red");
                    });
                });
                return () => {
                    unsubscribe1();
                    unsubscribe2();
                    setDates({});
                    setPeriods([]);
                };
            }
        }
    }, [user?.uid, listingId]);

    const markDates = (start: string, end: string, color: string) => {
        let markedDates: Record<string, any> = {};
        let current = new Date(start);

        const period = start + ":" + end;
        setPeriods((prevPeriods) => [...prevPeriods, period]);

        while (current <= new Date(end)) {
            let dateAsString = current.toISOString().split("T")[0];
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

    const unMarkDates = (period: string) => {
        const [start, end] = period.split(":");
        let current = new Date(start);

        setPeriods((prevPeriods) => {
            const newPeriods = [...prevPeriods];
            return newPeriods.filter((p) => p !== period);
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
                setDates((prevDates) => ({ ...prevDates, [day]: { color: "green", textColor: "white", startingDay: true } }));
            } else if (new Date(firstDay) < new Date(day)) {
                markDates(firstDay, day, "green");
                setFirstDay("");
            }
        } else {
            unMarkDates(dates[day].period);
        }
    }

    const handleSubmit = async () => {
        if (periods.length && jobRole && description) {
            try {
                const document = {
                    jobRole: jobRole,
                    description: description,
                };
                if (listingId) {
                    const opp = await updateDoc(doc(db, "Business", user.uid, "Opportunities", listingId), document);
                } else {
                    const opp = await addDoc(collection(db, "Business", user.uid, "Opportunities"), document);
                    for (let period of periods) {
                        await addDoc(collection(db, "Business", user.uid, "Opportunities", opp.id, "Availabilities"), {
                            period: period.split(":"),
                        });
                    }
                }
                // router.replace("/(tabs)/ViewCurrentOpportunities");
                setDates({});
                setPeriods([]);
                // setJobRole("");
                // setDescription("");
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {listingId ? <Text style={styles.title}>Edit an Opportunity...</Text> : <Text style={styles.title}>Post an Opportunity...</Text>}

            <View style={styles.inputContainer}>
                {listingId ? <Text style={styles.label}>Edit the job role</Text> : <Text style={styles.label}>What is the job role?</Text>}
                <TextInput style={styles.input} value={jobRole} onChangeText={setJobRole} placeholder="The job role is.." />
            </View>

            <View style={styles.inputContainer}>
                {listingId ? <Text style={styles.label}>Edit the description</Text> : <Text style={styles.label}>What is the description?</Text>}
                <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="The opportunity involves.." />
            </View>

            <View style={styles.inputContainer}>
                {listingId ? (
                    <Text style={styles.label}>What are the new dates for this opportunity</Text>
                ) : (
                    <Text style={styles.label}>What dates would like to advertise the opportunity?</Text>
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
                    markedDates={dates}
                    onDayPress={(day: DayPressEvent) => handleDay(day.dateString)}
                />
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
