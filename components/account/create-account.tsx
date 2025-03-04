import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInAnonymously,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "@/database/firebase";
import { Link, useLocalSearchParams } from "expo-router";
import styles from "../../app/styles";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import { db } from "@/database/firebase";
import { setDoc, doc } from "firebase/firestore";

const CreateAccount: React.FC<accountProps> = ({ accountType, setAccountType, setIsNewUser }) => {
    const { user, setUser } = useUserContext();
    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleCreateAccount = () => {
        if (!email || !password || !displayName) {
            setError("Please fill out all fields.");
            return;
        }
        if (accountType) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userData: User = {
                        uid: user.uid,
                        displayName: displayName,
                        email: email,
                        photoUrl: ""
                    };
                    updateProfile(user, {
                        displayName: displayName,
                    });
                    setUser(userData);
                    setDoc(doc(db, accountType, user.uid), userData);

                    // router.replace("/(tabs)/success-sign-in");
                    // sendEmailVerification(user)
                    //   .then(() => {
                    //     alert("Email verification sent.");
                    //   })
                    //   .catch((error) => {
                    //     console.error("Error sending email verification:", error);
                    //   });
                    setError("");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                    if (errorCode === "auth/email-already-in-use") {
                        setError("Email already in use.");
                    }
                    if (errorCode === "auth/weak-password") {
                        setError("Password should include at least an upper case letter, a lower case letter and needs to be at least 6 digits.");
                    }
                });
        } else {
            setError("Please choose your account type.");
        }
    };

    const handleGuestSignIn = () => {
        signInAnonymously(auth)
            .then(() => {
                // setUser("Guest");
                alert("Signed in as guest!");
                setError("");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            {user ? (
                <Text style={styles.title}>Signed in as {user.displayName ? user.displayName : user.email}</Text>
            ) : (
                <Text style={styles.title}>Create {accountType} Account</Text>
            )}
            <Button title="Student" onPress={() => setAccountType("Student")} />
            <Text> OR</Text>
            <Button title="Business" onPress={() => setAccountType("Business")} />

            <TextInput style={styles.input} placeholder="Display Name" value={displayName} onChangeText={setDisplayName} autoCapitalize="words" />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.fixToText}>
                <Button title="Create Account" onPress={handleCreateAccount} />
                <Button title="Continue as guest" onPress={handleGuestSignIn} />
            </View>
            <Text>Already have an account?</Text>
            <Button
                title="Sign in"
                onPress={() => {
                    setIsNewUser(false);
                }}
            />
        </View>
    );
};

export default CreateAccount;
