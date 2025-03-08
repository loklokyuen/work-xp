import { Button, Chip, IconButton, Text, TextInput, ActivityIndicator } from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import styles from "@/app/styles";
import { useUserContext } from "@/context/UserContext";
import { getStudentById } from "@/database/student";

export function ReadStudent() {
    const { user } = useUserContext();
    const [studentInfo, setStudentInfo] = useState<Student>();
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        if (!user) return;
        getStudentById(user.uid)
            .then((res) => {
                if (res) {
                    setStudentInfo({
                        uid: res.uid,
                        displayName: res.displayName || "",
                        photoUrl: res.photoUrl || "",
                        email: res.email || "",
                        county: res.county || "",
                        personalStatement: res.personalStatement || "",
                        applications: [],
                        reviews: [],
                        subjects: res.subjects || [],
                        experience: res.experience || "",
                    });
                    setLoading(false);
                    return true;
                } else return false;
            })
            .then((userFound) => {
                if (!userFound) {
                    setLoading(false);
                }
            });
    }, [user]);
    if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;

    return (
        <View>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Personal Statement:
            </Text>
            <View style={{ flexDirection: "row" }}>
                <Text variant="bodyMedium" style={{ flex: 1, margin: 12, borderWidth: 1, padding: 10, minHeight: 40 }}>
                    {studentInfo?.personalStatement}
                </Text>
            </View>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Experience:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {studentInfo?.experience}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Email:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {studentInfo?.email}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                County:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {studentInfo?.county}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Subjects:
            </Text>
            {studentInfo?.subjects.length === 0 ? (
                <Text variant="bodyMedium" style={styles.data}>
                    No subjects added yet
                </Text>
            ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 10 }}>
                    {studentInfo?.subjects.map((subject) => {
                        return (
                            <Chip key={subject} style={{ margin: 3 }}>
                                {subject}
                            </Chip>
                        );
                    })}
                </View>
            )}
        </View>
    );
}
