import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import styles from "../styles";

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "@/database/firebase";
import { addNewUser } from "@/database/user";
import { setUserAccountType, useUserContext } from "@/context/UserContext";

import { router } from "expo-router";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/database/firebase";

const CreateAccount = () => {
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleCreateAccount = async () => {
        if (!email || !password || !displayName) {
            setError("Please fill out all fields.");
            return;
        }
        if (accountType) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
                setUser(userData);
                setUserAccountType(accountType);
                await addNewUser(user.uid, accountType, displayName || "", user.photoURL || "", email || "");
                // sendEmailVerification(user)
                //   .then(() => {
                //     alert("Email verification sent.");
                //   })
                //   .catch((error) => {
                //     console.error("Error sending email verification:", error);
                //   });
                setError("");
                await setDoc(doc(db, "Users", user.uid), {
                    accountType: accountType,
                });
                router.replace("/(tabs)/account");
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
                if (errorCode === "auth/email-already-in-use") {
                    setError("Email already in use.");
                }
                if (errorCode === "auth/weak-password") {
                    setError("Password should include at least an upper case letter, a lower case letter and needs to be at least 6 digits.");
                }
            }
        } else {
            setError("Please choose your account type.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create {accountType} Account</Text>
            <View style={styles.buttonContainer}>
                <Button mode="contained-tonal" onPress={() => setAccountType("Student")}>
                    Student
                </Button>
                <Text variant="titleMedium" style={{ textAlign: "center", alignContent: "center" }}>
                    {" "}
                    OR
                </Text>
                <Button mode="contained-tonal" onPress={() => setAccountType("Business")}>
                    Business
                </Button>
            </View>
            <TextInput style={styles.input} label="Display Name" value={displayName} onChangeText={setDisplayName} autoCapitalize="words" />
            <TextInput style={styles.input} label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.buttonContainer}>
                <Button mode="contained-tonal" onPress={handleCreateAccount}>
                    Create Account
                </Button>
            </View>
            <Text variant="titleMedium" style={{ textAlign: "center", margin: 10 }}>
                Already have an account?
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        router.replace("/SignIn");
                    }}
                >
                    Sign in
                </Button>
            </View>
        </View>
    );
};

export default CreateAccount;
