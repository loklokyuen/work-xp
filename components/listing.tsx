import { useUserContext } from "@/context/UserContext";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { addDoc, collection, getDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";

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
    const [availability, setAvailability] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");

    const [firstDay, setFirstDay] = useState<string>("");
    const [confirmedDates, setConfirmedDates] = useState<Record<string, any>>([]);
    const [proposedDates, setProposedDates] = useState<Record<string, any>>([]);

    useEffect(() => {
        if (user?.uid) {
            // need to amend this if statement so useeffect runs only if user is business
            if (listingId) {
                getDoc(doc(db, "Business", user.uid, "Opportunities", listingId)).then((document) => {
                    const data = document.data();
                    if (data) {
                        const availability = data.availability;
                        setJobRole(data.jobRole);
                        setDescription(data.description);
                        setAvailability(availability);
                        setConfirmedDates({ ...markDates(availability[0], availability[1], "red") });
                    }
                });

                return () => {
                    setConfirmedDates([]);
                    setProposedDates([]);
                };
            } else {
                const unsubcribe = onSnapshot(collection(db, "Business", user.uid, "Opportunities"), (snapshot) => {
                    let dates = {};
                    const query = snapshot.docs.map((doc) => {
                        const availability = doc.data().availability;
                        dates = { ...dates, ...markDates(availability[0], availability[1], "red") };
                    });
                    setConfirmedDates(dates);
                });

                return () => {
                    unsubcribe();
                    setConfirmedDates([]);
                    setProposedDates([]);
                };
            }
        }
    }, [user?.uid, listingId]);

    const markDates = (startDate: string, endDate: string, color: string) => {
        let markedDates: Record<string, any> = {};
        let current = new Date(startDate);

        while (current <= new Date(endDate)) {
            let dateAsString = current.toISOString().split("T")[0];
            markedDates[dateAsString] = {
                color: color,
                textColor: "white",
                startingDay: dateAsString === startDate,
                endingDay: dateAsString === endDate,
            };
            current.setDate(current.getDate() + 1);
        }

        return markedDates;
    };

    function handleDay(day: DayPressEvent) {
        if (!firstDay || new Date(firstDay) > new Date(day.dateString)) {
            setAvailability([]);
            setProposedDates({ [day.dateString]: { color: "green", textColor: "white", startingDay: true } });
            setFirstDay(day.dateString);
        } else if (new Date(firstDay) < new Date(day.dateString)) {
            setAvailability([firstDay, day.dateString]);
            setProposedDates(markDates(firstDay, day.dateString, "green"));
            setFirstDay("");
        }
    }

    const handleSubmit = async () => {
        if (availability.length && jobRole && description) {
            try {
                const document = {
                    jobRole: jobRole,
                    description: description,
                    availability: availability,
                };
                if (listingId) {
                    const docRef = doc(db, "Business", user.uid, "Opportunities", listingId);
                    await updateDoc(docRef, document);
                } else {
                    const collectionRef = collection(db, "Business", user.uid, "Opportunities");
                    await addDoc(collectionRef, document);
                }
                setAvailability([]);
                setJobRole("");
                setDescription("");
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
                    markedDates={{
                        ...proposedDates,
                        ...confirmedDates,
                    }}
                    onDayPress={handleDay}
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
