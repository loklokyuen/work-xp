import { useState, useEffect, useContext } from "react";
import { useUserContext } from "../../../../context/UserContext";
import { View, ScrollView } from "react-native";
import { Text, Button, useTheme, Surface } from "react-native-paper";
import { doc, onSnapshot, collection, deleteDoc } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { StyleSheet } from "react-native";
import { Redirect, router } from "expo-router";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { SnackbarContext } from "@/context/SnackbarProvider";

export default function Opportunities() {
	const { showSnackbar } = useContext(SnackbarContext);
	const { user, accountType } = useUserContext();
	const [opportunities, setOpportunities] = useState<any[]>([]);
	const [openConfirm, setOpenConfirm] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const { colors, fonts } = useTheme();

	if (accountType === "Student") {
		return <Redirect href={"/+not-found"} />;
	}
	useEffect(() => {
		if (user?.uid) {
			const collectionRef = collection(
				db,
				"Business",
				user.uid,
				"Opportunities"
			);
			const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
				setOpportunities(
					snapshot.docs.map((doc) => {
						return { id: doc.id, ...doc.data() };
					})
				);
			});
			return () => {
				setOpportunities([]);
				unsubscribe();
			};
		}
	}, [user?.uid]);

	const handleDelete = async () => {
		try {
			await deleteDoc(
				doc(db, "Business", user!.uid, "Opportunities", deleteId!)
			);
			showSnackbar("Listing deleted successfully!", "success", 5000);
		} catch (error) {
			showSnackbar(
				"Unable to delete listing. Please try again later.",
				"error",
				5000
			);
		} finally {
			setOpenConfirm(false);
			setDeleteId(null);
		}
	};

	return (
		<ScrollView>
			<View>
				{opportunities.length === 0 ? (
					<Text
						variant="bodyMedium"
						style={{
							padding: 20,
							textAlign: "center",
							fontFamily: "Lato",
						}}>
						You have not posted any opportunity yet.
					</Text>
				) : (
					opportunities.map((opp, index) => {
						return (
							<Surface style={[styles.card, { margin: 10 }]} key={index}>
								<Text
									style={StyleSheet.compose(styles.role, {
										fontFamily: "Lato",
										color: colors.primary,
									})}>
									{opp.jobRole}
								</Text>
								<Text
									style={StyleSheet.compose(styles.description, {
										fontFamily: "Lato",
									})}>
									{opp.description}
								</Text>
								<Button
									labelStyle={{ fontFamily: "Lato" }}
									onPress={() => {
										router.push({
											pathname: "/(tabs)/opportunity/(Business)/listing",
											params: { listingId: opp.id },
										});
									}}>
									Edit Listing
								</Button>
								<Button
									labelStyle={{ fontFamily: "Lato" }}
									onPress={() => {
										setDeleteId(opp.id);
										setOpenConfirm(true);
									}}>
									Delete Listing
								</Button>
								<Button
									labelStyle={{ fontFamily: "Lato" }}
									onPress={() => {
										router.push({
											pathname: "/(tabs)/opportunity/(Business)/applications",
											params: { id: opp.id },
										});
									}}>
									View Applications
								</Button>
							</Surface>
						);
					})
				)}
			</View>
			<View style={styles.buttonContainer}>
				<Button
					mode="contained"
					style={{
						backgroundColor: colors.primary,
						borderRadius: 8,
						paddingLeft: 5,
						paddingRight: 5,
						marginBottom: 15,
						width: "50%",
					}}
					labelStyle={{
						fontFamily: "Lato",
						fontSize: 16,
						fontWeight: "normal",
						color: colors.onPrimary,
					}}
					onPress={() => {
						router.push({
							pathname: "/(tabs)/opportunity/(Business)/listing",
							params: { listingId: "" },
						});
					}}>
					Post Listing
				</Button>
			</View>

			{/* Confirmation Modal */}
			<ConfirmActionModal
				open={openConfirm}
				onClose={() => setOpenConfirm(false)}
				title="Delete Listing?"
				onConfirmAction={handleDelete}
			/>
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
	role: {
		fontSize: 18,
		fontWeight: "bold",
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
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		gap: 5,
	},
});
