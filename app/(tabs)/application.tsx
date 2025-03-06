import { useUserContext } from "@/context/UserContext";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { addDoc, collection, getDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { snapshot } from "node:test";
import { ColorProperties } from "react-native-reanimated/lib/typescript/Colors";

type DayPressEvent = {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
};

export default function Application({ listingId }: { listingId: string }) {
    const { user } = useUserContext();

    const [jobRole, setJobRole] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");

    const [firstDay, setFirstDay] = useState<string>("");

    const [dates, setDates] = useState<Record<string, any>>({});
    const [periods, setPeriods] = useState<string[]>([]);
    const [why, setWhy] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [chosenDates, setChosenDates] = useState<Record<string, any>>({});

    const BusinessId = "Qf1ha917fUU7oDmACzZ3msxI5Yk2";
    const OpportunityId = "Knj2eN5H6Qen00vx4kNR";

    useEffect(() => {
        if (user?.uid) {
            const unsubscribe1 = onSnapshot(doc(db, "Business", BusinessId, "Opportunities", OpportunityId), (snapshot) => {
                const data = snapshot.data();

                if (data) {
                    setJobRole(data.jobRole);
                    setDescription(data.description);
                }
            });
            const unsubscribe2 = onSnapshot(collection(db, "Business", BusinessId, "Opportunities", OpportunityId, "Availabilities"), (snapshot) => {
                snapshot.docs.forEach((doc) => {
                    const period = doc.data().period;
                    markDates(period[0], period[1], "red");
                });
            });
            const unsubscribe3 = onSnapshot(doc(db, "Business", BusinessId), (snapshot) => {
                const data = snapshot.data();

                if (data) {
                    setCompanyName(data.displayName);
                }
            });

            return () => {
                unsubscribe1();
                unsubscribe2();
                unsubscribe3;
                setDates({});
                setPeriods([]);
            };
        }
    }, [user?.uid, listingId]);

    // useEffect(() => {
    //     if (user?.uid) {
    //         if (listingId) {
    //             const unsubscribe1 = onSnapshot(doc(db, "Business", user.uid, "Opportunities", listingId), (snapshot) => {
    //                 const data = snapshot.data();
    //                 if (data) {
    //                     setJobRole(data.jobRole);
    //                     setDescription(data.description);
    //                 }
    //             });
    //             const unsubscribe2 = onSnapshot(collection(db, "Business", user.uid, "Opportunities", listingId, "Availabilities"), (snapshot) => {
    //                 snapshot.docs.forEach((doc) => {
    //                     console.log(doc.id);
    //                     const period = doc.data().period;
    //                     markDates(period[0], period[1], "red");
    //                 });
    //             });
    //             return () => {
    //                 unsubscribe1();
    //                 unsubscribe2();
    //                 setDates({});
    //                 setPeriods([]);
    //             };
    //         }
    //     }
    // }, [user?.uid, listingId]);

    const markDates = (start: string, end: string, color: string) => {
        let markedDates: Record<string, any> = {};
        let current = new Date(start);

        const period = start + ":" + end;
        setPeriods((prevPeriods) => [...prevPeriods, period]);

        while (current <= new Date(end)) {
            let dateAsString = current.toISOString().split("T")[0];
            markedDates[dateAsString] = {
                color: "blue",
                textColor: "white",
                startingDay: dateAsString === start,
                endingDay: dateAsString === end,
                period: period,
            };
            current.setDate(current.getDate() + 1);
        }
        setDates((prevDates) => ({ ...prevDates, ...markedDates }));
    };

    function handleDay(day: string) {
        if (dates[day]) {
            const chosen = dates[day].period;

            setChosenDates((prevChosenDates) => ({ ...prevChosenDates, [dates[day].period]: "" }));

            // console.log("hello", chosen);
            const start = chosen.split(":")[0];
            const end = chosen.split(":")[1];
            // console.log(start, end);
            let current = new Date(start);
            // console.log(current);
            let markedDates = { ...dates };
            // console.log(markedDates);

            while (current <= new Date(end)) {
                let dateAsString = current.toISOString().split("T")[0];
                markedDates[dateAsString].color = "green";
                current.setDate(current.getDate() + 1);
            }
            setDates((prevDates) => {
                return markedDates;
            });
        }
    }

    useEffect(() => {
        console.log("dates", dates);
    }, [dates]);

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

                setDates({});
                setPeriods([]);
            } catch (err) {
                console.log(err);
            }
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
                <Text style={styles.label}>Dates Chosen:</Text>
                {Object.keys(chosenDates).map((date, index) => {
                    return <Text key={index}> {date}</Text>;
                })}
            </View>

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
