import { Button, Chip, IconButton, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import styles from "@/app/styles";

export function ReadonlyStudentInfo({ studentInfo }: StudentProps) {
    return (
        <View>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Personal Statement:
            </Text>
            <View style={{ flexDirection: "row" }}>
                <Text variant="bodyMedium" style={{ flex: 1, margin: 12, borderWidth: 1, padding: 10, minHeight: 40 }}>
                    {studentInfo.personalStatement}
                </Text>
            </View>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Experience:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {studentInfo.experience}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Email:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {studentInfo.email}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                County:
            </Text>
            <Text variant="bodyMedium" style={styles.data}>
                {studentInfo.county}
            </Text>
            <Text variant="titleMedium" style={{ marginHorizontal: 10 }}>
                Subjects:
            </Text>
            {studentInfo.subjects.length === 0? <Text variant="bodyMedium" style={styles.data}>No subjects added yet</Text> :
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 10 }}>
                {studentInfo.subjects.map((subject) => {
                    return (
                        <Chip key={subject} style={{ margin: 3 }}>
                            {subject}
                        </Chip>
                    );
                })}
            </View>}
        </View>
    );
}
