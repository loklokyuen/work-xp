import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../database/firebase";
import styles from "../../app/styles";
import { useUserContext } from "@/context/UserContext";
import { getUserById } from "@/database/user";

const SignIn: React.FC<accountProps> = ({ setAccount }) => {
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
        if (accountType) {
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
                        // router.replace("/(tabs)/success-sign-in");
                        setError("");
                    });
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

            <Button title="Create Account" onPress={() => setAccount(false)} />
        </View>
    );
};

export default SignIn;
