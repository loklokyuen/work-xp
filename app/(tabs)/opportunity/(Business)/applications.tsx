import {
	getApplicationsByBusinessId,
	updateApplicationAccepted,
} from "@/database/applications";
import { getApplicationsByOppId } from "@/database/applications";
import { useState, useEffect, useContext } from "react";
import { useUserContext } from "@/context/UserContext";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Redirect, useNavigation } from "expo-router";
import ApplicationCard from "./ApplicationCard";
import { SnackbarContext } from "@/context/SnackbarProvider";

export default function Applications() {
	const { showSnackbar } = useContext(SnackbarContext);
	const navigation = useNavigation();
	const [applications, setApplications] = useState<Application[]>([]);
	const { user, accountType } = useUserContext();
	const { id } = useLocalSearchParams<Record<string, string>>();
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const { colors, fonts } = useTheme();

	if (accountType === "Student") {
		return <Redirect href="/+not-found" />;
	}
	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: "Applications",
		});
	}, [navigation]);

	useEffect(() => {
		if (id) {
			getApplicationsByOppId(id)
				.then((res) => {
					const filteredApplications = res.filter(
						(application) =>
							application.isAccepted === undefined ||
							application.isAccepted === null
					);
					setApplications(filteredApplications);
				})
				.catch((error) => {
					showSnackbar("Unable to fetch applications", "error", 5000);
				});
		}
	}, [id]);

	const handleDecision = async (uid: string, accepted: boolean) => {
		try {
			await updateApplicationAccepted(uid, accepted);
			showSnackbar(
				`You have successfully ${
					accepted ? "accepted" : "declined"
				} this application.`,
				"success",
				5000
			);

			if (id) {
				const updatedApplications = await getApplicationsByOppId(id);
				const filteredApplications = updatedApplications.filter(
					(application) =>
						application.isAccepted === undefined ||
						application.isAccepted === null
				);
				setApplications(filteredApplications);
			}

			setTimeout(() => {
				setSuccessMessage(null);
			}, 3000);
		} catch (error) {
			showSnackbar("Error updating application", "error", 5000);
		}
	};

	return (
		<ScrollView>
			<View style={{ alignContent: "center" }}>
				{applications.length === 0 && (
					<Text
						variant="bodyMedium"
						style={{ padding: 20, textAlign: "center" }}>
						No application yet
					</Text>
				)}
				{applications.map((application, index) => (
					<ApplicationCard
						key={index}
						application={application}
						onDecision={handleDecision}
					/>
				))}
			</View>
		</ScrollView>
	);
}
