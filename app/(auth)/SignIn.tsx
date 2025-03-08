import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
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
    const [isHovered, setIsHovered] = useState(false);
    const { colors, fonts } = useTheme();

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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.primary, ...fonts.titleLarge }]}>User Sign In</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.primaryContainer,
                        color: colors.primary,
                        ...fonts.bodyLarge,
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
                        ...fonts.bodyLarge,
                    },
                ]}
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained-tonal"
                    onPress={handleSignIn}
                    style={{
                        backgroundColor: colors.secondary, // Background color
                        borderRadius: 8, // Optional: For rounded edges
                    }}
                    labelStyle={{
                        fontFamily: "SpaceMono", // Apply custom font
                        fontSize: 16, // Adjust font size as needed
                        fontWeight: "normal", // Set font weight
                        color: colors.tertiary, // Text color (onPrimary works well for contrast)
                    }}
                >
                    Sign In
                </Button>
            </View>
            <TouchableOpacity
                onPress={handleForgetPassword}
                style={{
                    backgroundColor: colors.primaryContainer,
                    paddingVertical: 8, // Adds vertical padding for height
                    paddingHorizontal: 16, // Adds horizontal padding for width
                    borderRadius: 20, // Makes the box rounded (adjust as needed)
                    justifyContent: "center", // Centers the text vertically
                    alignItems: "center", // Centers the text horizontally
                    marginVertical: 10, // Optional: Adds vertical spacing between elements
                }}
            >
                <Text
                    style={[
                        styles.option,
                        {
                            fontFamily: "SpaceMono", // Apply custom font
                            fontSize: 16, // Adjust font size as needed
                            color: colors.primary, // Set text color to primary or other color
                            textAlign: "center", // Centers the text horizontally
                        },
                    ]}
                >
                    Forgot password
                </Text>
            </TouchableOpacity>
            <Text
                style={[
                    {
                        textAlign: "center",
                        margin: 10,
                        fontFamily: "SpaceMono", // Apply custom font
                        fontSize: 20, // Adjust font size as needed
                        color: colors.primary, // Set text color to primary or other color
                    },
                ]}
            >
                Don't have an account?
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    onPress={() => {
                        router.replace("/CreateAccount");
                    }}
                    labelStyle={{
                        fontFamily: "SpaceMono", // Apply custom font
                        fontSize: 16, // Adjust font size as needed
                        fontWeight: "normal", // Font weight (use 'bold' or 'normal' as needed)
                        color: colors.tertiary, // Set the text color to primary or other color
                    }}
                    style={{
                        borderRadius: 8, // Optional: rounded corners for the button
                        backgroundColor: colors.secondary, // Set border color to match the primary color
                    }}
                >
                    Create Account
                </Button>
            </View>
        </View>
    );
};

export default SignIn;
