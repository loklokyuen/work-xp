import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/database/firebase";
import styles from "../styles";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/database/firebase";

const SignIn = () => {
    const { setUser } = useUserContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setAccountType } = useUserContext();

    const handleSignIn = () => {
        if (!email || !password) {
            setError("Please fill out all fields.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser({
                    uid: user.uid,
                    displayName: user.displayName || "",
                    email: user.email || "",
                    photoUrl: user.photoURL || "",
                });
                setError("");
                return getDoc(doc(db, "Users", user.uid));
            })
            .then((document) => {
                const data = document.data();
                setAccountType(data?.accountType);
                router.replace("/(tabs)/(account)");
                // if (!user.emailVerified) {
                //     sendEmailVerification(user)
                //     alert('Please verify your email before signing in.');
                // } else {
                //     alert('Signed in successfully!');
                // }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
                if (errorCode === "auth/invalid-credential") {
                    setError("Incorrect password. Please check.");
                }
            });
    };

    const handleForgetPassword = () => {
        if (email === "") {
            setError("Please enter your email address.");
            return;
        }
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
            <Text style={styles.title}>User Sign In</Text>
            <TextInput style={styles.input} label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.buttonContainer}>
                <Button mode="contained-tonal" onPress={handleSignIn}>
                    Sign In
                </Button>
            </View>
            <Text style={styles.option} onPress={handleForgetPassword}>
                Forgot password
            </Text>
            <Text variant="titleMedium" style={{ textAlign: "center", margin: 10 }}>
                Don't have an account?
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        router.replace("/CreateAccount");
                    }}
                >
                    Create Account
                </Button>
            </View>
        </View>
    );
};

export default SignIn;
