import { ReadonlyBusinessInfo } from "../../components/account/ReadonlyBusinessInfo";
import { ReadonlyStudentInfo } from "../../components/account/ReadonlyStudentInfo";
import { EditableBusinessInfo } from "../../components/account/EditableBusinessInfo";
import { EditableStudentInfo } from "../../components/account/EditableStudentInfo";
import GuestModePrompt from "../../components/account/GuestModePrompt";

import { useContext, useEffect, useState } from "react";
import { View, Platform } from "react-native";
import {
	ActivityIndicator,
	Button,
	IconButton,
	Text,
	useTheme,
} from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { getBusinessById } from "@/database/business";
import { getStudentById } from "@/database/student";
import { auth } from "@/database/firebase";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from "firebase/auth";

import { useUserContext } from "@/context/UserContext";
import styles from "@/app/styles";
import ImageViewer from "../../components/expoComponents/imageViewer";

import AvatarPickingModal from "@/modal/AvatarPickingModal";
import { ChangePasswordModal } from "@/modal/ChangePasswordModal";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { Redirect, useNavigation } from "expo-router";
import { getUserAccountType } from "@/database/user";
import { SnackbarContext } from "@/context/SnackbarProvider";

export default function ProfilePage() {
	const navigation = useNavigation();
	const { showSnackbar } = useContext(SnackbarContext);

	const [loading, setLoading] = useState<Boolean>(true);
	const [editMode, setEditMode] = useState<Boolean>(false);
	const [guestMode, setGuestMode] = useState<Boolean>(false);
	const [businessInfo, setBusinessInfo] = useState<Business>();
	const [studentInfo, setStudentInfo] = useState<Student>();
	const [changesMade, setChangesMade] = useState<Boolean>(false);
	const [openAvatarPicker, setOpenAvatarPicker] = useState<boolean>(false);
	const [openConfirmBack, setOpenConfirmBack] = useState<boolean>(false);
	const [openLogout, setOpenLogout] = useState<boolean>(false);
	const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
	const { user, setUser, accountType, setAccountType } = useUserContext();
	const placeHolderImage = require("@/assets/images/background-image.png");

	const { colors, fonts } = useTheme();

	if (!accountType) {
		return <Redirect href="/(auth)/main" />;
	}

	useEffect(() => {
		if (!user) return;

		const fetchUserData = async () => {
			try {
				setLoading(true);

				if (!accountType) {
					const userAccountType = await getUserAccountType(user.uid);
					setAccountType(userAccountType);
					if (userAccountType === "Guest") {
						setGuestMode(true);
						setLoading(false);
						return;
					}
				}
				if (accountType === "Guest") {
					setGuestMode(true);
					setLoading(false);
					return;
				}
				if (accountType === "Business") {
					const res = await getBusinessById(user.uid);
					setBusinessInfo({
						uid: res.uid,
						displayName: res.displayName || "",
						sector: res.sector || "",
						photoUrl: res.photoUrl || "",
						email: res.email || "",
						address: res.address || "",
						county: res.county || "",
						description: res.description || "",
						phoneNumber: res.phoneNumber || "",
						opportunities: [],
						reviews: [],
						applications: [],
					});
					setGuestMode(false);
				} else if (accountType === "Student") {
					const res = await getStudentById(user.uid);
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
					setGuestMode(false);
				}
			} catch (error) {
				showSnackbar(
					"Unable to fetch user data. Please try again later.",
					"error",
					5000
				);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [user, accountType]);

	function handleUpdateInfo() {
		if (!user) return;
		setLoading(true);
		if (accountType === "Business") {
			getBusinessById(user.uid).then((res) => {
				setBusinessInfo({
					uid: res.uid,
					displayName: res.displayName || "",
					sector: res.sector || "",
					photoUrl: res.photoUrl || "",
					email: res.email || "",
					address: res.address || "",
					county: res.county || "",
					description: res.description || "",
					phoneNumber: res.phoneNumber || "",
					opportunities: [],
					reviews: [],
					applications: [],
				});
				setLoading(false);
			});
		} else {
			getStudentById(user.uid).then((res) => {
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
			});
		}
	}

	const handleLogout = async () => {
		try {
			auth.signOut();
			setUser(null);
			setAccountType(null);
		} catch (error) {
			// setError(error.message);
		}
	};
	const handleChangePassword = async (
		oldPassword: string,
		newPassword: string
	) => {
		const user = auth.currentUser;
		if (user && user.email) {
			const credential = EmailAuthProvider.credential(user.email, oldPassword);
			await reauthenticateWithCredential(user, credential);
			updatePassword(user, newPassword)
				.then(() => {
					showSnackbar("Password changed successfully!", "success", 5000);
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					if (errorCode === "auth/wrong-password") {
						showSnackbar(
							"Error: The current password is incorrect.",
							"error",
							5000
						);
					} else if (errorCode === "auth/weak-password") {
						showSnackbar("Error: The new password is too weak.", "error", 5000);
					} else {
						showSnackbar("Error: " + errorMessage, "error", 5000);
					}
				});
		}
	};

	if (loading)
		return (
			<ActivityIndicator
				size="large"
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			/>
		);
	if (guestMode) return <GuestModePrompt />;
	return (
		<View style={styles.container}>
			<KeyboardAwareScrollView
				enableOnAndroid
				contentContainerStyle={[
					styles.scrollViewContent,
					{ paddingTop: Platform.OS === "ios" ? 0 : 20 },
				]}>
				<Text
					variant="titleMedium"
					style={{
						textAlign: "left",
						margin: 15,
						paddingTop: 10,
						fontSize: 16,
					}}>
					{!guestMode && accountType + " User Profile"}
				</Text>
				{!guestMode && (
					<View
						style={{
							alignItems: "flex-end",
							marginRight: 20,
							position: "absolute",
							right: 2,
							top: 10,
						}}>
						{editMode ? (
							<Button
								style={{
									backgroundColor: colors.quarternary,
									borderRadius: 100,
									marginBottom: 0,
								}}
								labelStyle={{
									fontFamily: "Lato",
									fontSize: 12,
									fontWeight: "normal",
									color: colors.surface,
								}}
								mode="contained-tonal"
								onPress={() => {
									if (changesMade) {
										setOpenConfirmBack(true);
									} else {
										setEditMode(!editMode);
									}
								}}>
								Back
							</Button>
						) : (
							<Button
								style={{
									backgroundColor: colors.quarternary,
									borderRadius: 100,
									marginBottom: 0,
									top: 10,
								}}
								labelStyle={{
									fontFamily: "Lato",
									fontSize: 12,
									fontWeight: "normal",
									color: colors.surface,
								}}
								mode="contained-tonal"
								onPress={() => {
									setEditMode(!editMode);
								}}>
								Edit
							</Button>
						)}
					</View>
				)}
				<ConfirmActionModal
					open={openConfirmBack}
					onClose={() => setOpenConfirmBack(false)}
					title="Confirm going back? Your unsaved changes will be lost."
					onConfirmAction={() => {
						setChangesMade(false);
						setEditMode(false);
						setOpenConfirmBack(false);
						handleUpdateInfo();
					}}
				/>
				{!editMode && !guestMode && (
					<View style={styles.centeredView}>
						<View style={{ alignItems: "center", position: "relative" }}>
							<ImageViewer
								imgSource={
									studentInfo?.photoUrl ||
									businessInfo?.photoUrl ||
									placeHolderImage
								}></ImageViewer>
							<IconButton
								icon="camera"
								size={20}
								onPress={() => setOpenAvatarPicker(!openAvatarPicker)}
								style={{
									position: "absolute",
									bottom: 0,
									right: 5,
									backgroundColor: "rgba(255, 255, 255, 0.8)",
									borderRadius: 150,
									padding: 5,
								}}
							/>
							<AvatarPickingModal
								open={openAvatarPicker}
								onClose={() => setOpenAvatarPicker(false)}></AvatarPickingModal>
						</View>
					</View>
				)}
				{!editMode && !guestMode && (
					<Text
						variant="titleLarge"
						style={{
							textAlign: "center",
							margin: 10,
							color: "#3E92CC",
							paddingTop: 10,
						}}>
						{studentInfo?.displayName || businessInfo?.displayName}
					</Text>
				)}
				{editMode ? (
					businessInfo ? (
						<EditableBusinessInfo
							businessInfo={businessInfo}
							onUpdateInfo={handleUpdateInfo}
							setChangesMade={setChangesMade}
							setEditMode={setEditMode}
						/>
					) : (
						studentInfo && (
							<EditableStudentInfo
								studentInfo={studentInfo}
								onUpdateInfo={handleUpdateInfo}
								setChangesMade={setChangesMade}
								setEditMode={setEditMode}
							/>
						)
					)
				) : businessInfo ? (
					<ReadonlyBusinessInfo businessInfo={businessInfo} />
				) : (
					studentInfo && <ReadonlyStudentInfo studentInfo={studentInfo} />
				)}
				{!editMode && !guestMode && (
					<View style={styles.proButtonContainer}>
						<Button
							style={{
								backgroundColor: colors.secondary,
								borderRadius: 8,
								paddingLeft: 5,
								paddingRight: 5,
								marginBottom: 15,
								width: "50%",
								alignSelf: "center",
							}}
							labelStyle={{
								fontFamily: "Lato",
								fontSize: 16,
								fontWeight: "normal",
								color: colors.onSecondary,
							}}
							// mode="outlined"
							onPress={() => {
								setOpenChangePassword(true);
							}}>
							Change Password
						</Button>
						<ChangePasswordModal
							open={openChangePassword}
							onClose={() => setOpenChangePassword(false)}
							onChangePassword={handleChangePassword}></ChangePasswordModal>
						<Button
							style={{
								backgroundColor: colors.error,
								borderRadius: 8,
								paddingLeft: 5,
								paddingRight: 5,
								marginBottom: 15,
								width: "50%",
								alignSelf: "center",
							}}
							labelStyle={{
								fontFamily: "Lato",
								fontSize: 16,
								fontWeight: "normal",
								color: colors.onError,
							}}
							// mode="outlined"

							onPress={() => setOpenLogout(true)}>
							Log out
						</Button>
						<ConfirmActionModal
							open={openLogout}
							onClose={() => setOpenLogout(false)}
							title="Confirm logout?"
							onConfirmAction={handleLogout}
						/>
					</View>
				)}
			</KeyboardAwareScrollView>
		</View>
	);
}
