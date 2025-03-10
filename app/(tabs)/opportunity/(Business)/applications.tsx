import { getApplicationsByBusinessId, updateApplicationAccepted } from "@/database/applications";
import { getApplicationsByOppId } from "@/database/applications";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { StyleSheet, Image } from "react-native";
import { View, ScrollView } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { Redirect } from "expo-router";

export default function Applications() {
    const [applications, setApplications] = useState<Application1[]>();
    const { user, accountType } = useUserContext();
    const { id } = useLocalSearchParams<Record<string, string>>();
    const { colors, fonts } = useTheme();

    if (accountType === "Student") {
        return <Redirect href="/+not-found" />;
    }

    useEffect(() => {
        if (id) {
            getApplicationsByOppId(id).then((res) => {
                console.log(res);
                setApplications(res);
            });
        }
    }, [id]);

    return (
        <ScrollView>
            <View style={styles.card}>
                {applications?.map((application, index) => {
                    return (
                        <View style={styles.card} key={index}>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    color: colors.primary,
                                    fontWeight: "bold",
                                })}
                            >
                                Username:
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                })}
                            >
                                {application.displayName}
                            </Text>
                            <Image source={{ uri: application.photoUrl }} style={{ width: 200, height: 200 }}></Image>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontWeight: "bold",
                                    color: colors.primary,
                                })}
                            >
                                Why they applied:
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontStyle: "italic",
                                    color: colors.tertiary,
                                })}
                            >
                                {application.whyApply}
                            </Text>

                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontWeight: "bold",
                                    color: colors.primary,
                                })}
                            >
                                Why they think they're suitable:
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontStyle: "italic",
                                    color: colors.tertiary,
                                })}
                            >
                                {application.whySuitable}
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontWeight: "bold",
                                    color: colors.primary,
                                })}
                            >
                                Chosen subjects:
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontStyle: "italic",
                                    color: colors.tertiary,
                                })}
                            >
                                {application.subjects}
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontWeight: "bold",
                                    color: colors.primary,
                                })}
                            >
                                Previous experience:
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontStyle: "italic",
                                    color: colors.tertiary,
                                })}
                            >
                                {application.experience}
                            </Text>
                            <Text
                                style={StyleSheet.compose(styles.text, {
                                    fontFamily: "SpaceMono",
                                    fontWeight: "bold",
                                    color: colors.primary,
                                })}
                            >
                                Dates applied for:{" "}
                                {application.datesApplied.map((date: string) => (
                                    <Text key={date}> {date} </Text>
                                ))}
                            </Text>
                            <Button
                                labelStyle={{
                                    fontFamily: "SpaceMono",
                                    color: colors.tertiary,
                                }}
                                style={{ backgroundColor: colors.secondary, margin: 5 }}
                                mode="contained"
                                onPress={() => updateApplicationAccepted(application.uid, true)}
                            >
                                Accept application
                            </Button>
                            <Button
                                labelStyle={{
                                    fontFamily: "SpaceMono",
                                    color: colors.onPrimary,
                                }}
                                style={{ backgroundColor: colors.error, margin: 5 }}
                                mode="contained"
                                onPress={() => updateApplicationAccepted(application.uid, false)}
                            >
                                Decline application
                            </Button>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },
    text: {
        fontSize: 18,
        // fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginBottom: 6,
    },
    availability: {
        fontSize: 12,
        color: "#007bff",
        fontWeight: "600",
    },
});
