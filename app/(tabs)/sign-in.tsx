import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signInAnonymously,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "../../database/firebase";
import { Link } from "expo-router";
import styles from "../styles";
import { router } from "expo-router";
import { useContext } from "react";
import { useUserContext } from "@/context/UserContext";
import { getStudentById } from "@/database/student";
import { getBusinessById } from "@/database/business";
import { getUserById } from "@/database/user";

const SignIn = () => {
    const [accountType, setAccountType] = useState<string>("");
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user, setUser } = useUserContext();

    const handleSignIn = () => {
        if (!email || !password) {
            setError("Please fill out all fields.");
            return;
        }
        if (accountType){
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log(userCredential);
                    const user = userCredential.user;
                    getUserById(user.uid, accountType).then((user) => {
                        setUser({
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email || "",
                            photoUrl: user.photoUrl || "",
                            accountType: accountType,
                        });
                    });
                    router.replace("/(tabs)/success-sign-in");
                    // if (!user.emailVerified) {
                    //     sendEmailVerification(user)
                    //     alert('Please verify your email before signing in.');
                    // } else {
                    //     alert('Signed in successfully!');
                    // }
                    setError("");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                });
        } else {
            setError("Please choose your account type.");
        }

    };

    const handleForgetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent!");
            })
            .catch((error) => {
                setError(error.message);
            });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{accountType} Sign In</Text>
            <Button title="Student" onPress={() => setAccountType("Student")} />
                <Text> OR</Text>
            <Button title="Business" onPress={() => setAccountType("Business")} />
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
            <Button title="Sign In" onPress={handleSignIn} />
            <Text style={styles.option} onPress={handleForgetPassword}>
                Forgot password
            </Text>
            <Text>Don't have an account?</Text>
            <Link href="/create-account">
                <Button title="Create Account" />
            </Link>
        </View>
    );
};

export default SignIn;
