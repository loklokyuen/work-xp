import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInAnonymously } from "firebase/auth";
import { auth } from "@/database/firebase";
import styles from "../../app/styles";
import { setUserAccountType, useUserContext } from "@/context/UserContext";
import { getUserById } from "@/database/user";

const SignIn: React.FC<accountProps> = ({ setIsNewUser }) => {
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignIn = () => {
        if (!email || !password) {
            setError("Please fill out all fields.");
            return;
        }
        if (accountType) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    getUserById(user.uid, accountType).then((user) => {
                        setUser({
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email || "",
                            photoUrl: user.photoUrl || ""
                        });
                        setUserAccountType(accountType);
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
                    if (errorCode === "auth/invalid-credential") {
                        setError("Incorrect password. Please check.");
                    }
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
          <Text style={styles.title}>{accountType} User Sign In</Text>
            <View style={styles.buttonContainer}>
            <Button mode="contained-tonal" onPress={() => setAccountType("Student")} >Student</Button>
            <Text variant="titleMedium" style={{textAlign: "center", alignContent: "center"}}> OR</Text>
            <Button mode="contained-tonal" onPress={() => setAccountType("Business")} >Business</Button>
            </View>
            <TextInput
                style={styles.input}
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput style={styles.input} label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.buttonContainer}>
                <Button mode="contained-tonal" onPress={handleSignIn} >Sign In</Button>
            </View>
            <Text style={styles.option} onPress={handleForgetPassword}>
                Forgot password
            </Text>
            <Text variant="titleMedium" style={{textAlign: "center", margin: 10}}>Don't have an account?</Text>
            <View style={styles.buttonContainer}>
                <Button mode="outlined"  onPress={() => setIsNewUser(true)} >Create Account</Button>
            </View>
        </View>
    );
};

export default SignIn;
