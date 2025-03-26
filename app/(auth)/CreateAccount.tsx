import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import styles from "../styles";

import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} from "firebase/auth";
import { auth, db } from "@/database/firebase";
import { addNewUser } from "@/database/user";
import { useUserContext } from "@/context/UserContext";
import { setDoc, doc } from "firebase/firestore";

import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateAccount = () => {
	const { user, setUser, accountType, setAccountType } = useUserContext();
	const [displayName, setDisplayName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const { colors, fonts } = useTheme();

	const handleCreateAccount = async () => {
		if (!email || !password || !displayName) {
			setError("Please fill out all fields.");
			return;
		}
		if (accountType) {
			try {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;
				const userData: User = {
					uid: user.uid,
					displayName: displayName,
					email: email,
					photoUrl: "",
				};
				await updateProfile(user, {
					displayName: displayName,
				});
				await addNewUser(
					user.uid,
					accountType,
					displayName || "",
					user.photoURL || "",
					email || ""
				);
				await setDoc(doc(db, "Users", user.uid), {
					accountType: accountType,
				});
				setUser(userData);
				setError("");
				router.replace("/(tabs)");
				// sendEmailVerification(user)
				//   .then(() => {
				//     alert("Email verification sent.");
				//   })
				//   .catch((error) => {
				//     console.error("Error sending email verification:", error);
				//   });
			} catch (error) {
				const errorCode = error.code;
				const errorMessage = error.message;
				setError(errorMessage);
				if (errorCode === "auth/email-already-in-use") {
					setError("Email already in use.");
				}
				if (errorCode === "auth/weak-password") {
					setError(
						"Password should include at least an upper case letter, a lower case letter and needs to be at least 6 digits."
					);
				}
			}
		} else {
			setError("Please choose your account type.");
		}
	};

	return (
		<KeyboardAwareScrollView
			enableOnAndroid
			contentContainerStyle={styles.scrollViewContent}>
			<View style={styles.container}>
				<Text
					style={[
						styles.title,
						{ color: colors.primary, ...fonts.titleLarge },
					]}>
					Create {accountType} Account
				</Text>
				<View style={styles.buttonContainer}>
					<Button
						style={{
							backgroundColor: colors.secondary,
							borderRadius: 8,
							paddingLeft: 5,
							paddingRight: 5,
							marginBottom: 15,
						}}
						labelStyle={{
							fontFamily: "Lato",
							fontSize: 16,
							fontWeight: "normal",
							color: colors.tertiary,
						}}
						//   mode="contained-tonal"
						onPress={() => setAccountType("Student")}>
						Student 🎒
					</Button>
					<Text variant="titleMedium" style={{ margin: 10, color: "#3E92CC" }}>
						or
					</Text>
					<Button
						style={{
							backgroundColor: colors.secondary,
							borderRadius: 8,
							paddingLeft: 5,
							paddingRight: 5,
							marginBottom: 15,
						}}
						labelStyle={{
							fontFamily: "Lato",
							fontSize: 16,
							fontWeight: "normal",
							color: colors.tertiary,
						}}
						//   mode="contained-tonal"
						onPress={() => setAccountType("Business")}>
						Business 🏢
					</Button>
				</View>
			</View>
			<TextInput
				style={[
					styles.input,
					{
						backgroundColor: colors.primaryContainer,
						color: colors.primary,
						...fonts.bodyMedium,
					},
				]}
				label="Display Name"
				value={displayName}
				onChangeText={setDisplayName}
				autoCapitalize="words"
			/>
			<TextInput
				style={[
					styles.input,
					{
						backgroundColor: colors.primaryContainer,
						color: colors.primary,
						...fonts.bodyMedium,
					},
				]}
				label="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={[
					styles.input,
					{
						backgroundColor: colors.primaryContainer,
						color: colors.primary,
						...fonts.bodyMedium,
					},
				]}
				label="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			{error ? <Text style={styles.error}>{error}</Text> : null}
			<View
				style={[
					styles.buttonContainer,
					{
						display: "flex",
						flexDirection: "column",
						alignItems: "stretch",
						width: "auto",
						alignSelf: "center",
					},
				]}>
				<Button
					style={{
						backgroundColor: colors.secondary,
						borderRadius: 8,
						paddingLeft: 5,
						paddingRight: 5,
						marginBottom: 15,
						marginTop: 10,
						paddingVertical: 4,
					}}
					labelStyle={{
						fontFamily: "Lato",
						fontSize: 16,
						fontWeight: "normal",
						color: colors.tertiary,
					}}
					mode="contained-tonal"
					onPress={handleCreateAccount}>
					Create Account
				</Button>
				<Text variant="titleMedium" style={{ margin: 10, color: "#3E92CC" }}>
					Already have an account?
				</Text>
				<Button
					style={{
						backgroundColor: colors.secondary,
						borderRadius: 8,
						paddingLeft: 5,
						paddingRight: 5,
						marginBottom: 15,
						paddingVertical: 4,
					}}
					labelStyle={{
						fontFamily: "Lato",
						fontSize: 16,
						fontWeight: "normal",
						color: colors.tertiary,
					}}
					mode="contained-tonal"
					onPress={() => {
						router.replace("/SignIn");
					}}>
					Sign in
				</Button>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default CreateAccount;
