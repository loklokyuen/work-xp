import styles from "../styles";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signInAnonymously,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "@/database/firebase";
import { useUserContext } from "@/components/UserContext";
import { router } from "expo-router";

const SuccessSignIn = () => {
    const { user, setUser } = useUserContext();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleChangePassword = () => {
        const user = auth.currentUser;
        if (user) {
            updatePassword(user, password)
                .then(() => {
                    alert("Password changed successfully!");
                    setError("");
                    setShowChangePassword(false);
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    };

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                router.replace("/(tabs)/sign-in");
                setUser({ uid: "", displayName: "", email: "", photoUrl: "" });
                setError("");
            })
            .catch(() => {
                // setError(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Successfully Signed In as {user.displayName}</Text>
            <View>
                {showChangePassword && (
                    <View>
                        <TextInput style={styles.input} placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry />
                        <Button title="Change password" onPress={handleChangePassword} />
                    </View>
                )}

                <Button title="Sign out" onPress={handleSignOut} />
                <Text
                    style={styles.option}
                    onPress={() => {
                        setShowChangePassword(true);
                    }}
                >
                    Change password
                </Text>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

export default SuccessSignIn;
