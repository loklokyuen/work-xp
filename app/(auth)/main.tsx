import { setUserAccountType, useUserContext } from "@/context/UserContext";

import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useState } from "react";

import { auth } from "@/database/firebase";
import { signInAnonymously } from "firebase/auth";
import { router } from "expo-router";

export default function AccountScreen() {
    const { user, setUser, setAccountType } = useUserContext();
    const [error, setError] = useState<string>("");

    const handleGuestSignIn = () => {
        signInAnonymously(auth)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser({
                    uid: user.uid,
                    displayName: "Guest",
                    email: "",
                    photoUrl: "",
                });
                setUserAccountType("Guest");
                setAccountType("Guest");
                setError("");
                router.replace("/(tabs)");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    return (
        <View style={{ backgroundColor: "#FFFAFF", flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text variant="titleLarge" style={{ margin: 10, color: "#3E92CC" }}>
                Welcome to Work-XP!
            </Text>
            <Text variant="titleMedium" style={{ margin: 20, color: "#07070A", textAlign: "center" }}>
                Find the work experience opportunity that's perfect for you, from the comfort of your phone!
            </Text>
            <Text variant="titleMedium" style={{ margin: 10, color: "#3E92CC" }}>
                New to the app?
            </Text>
            <Button
                mode="contained-tonal"
                style={{ margin: 10 }}
                onPress={() => {
                    router.replace("/CreateAccount");
                }}
            >
                Create an account
            </Button>
            <Text variant="titleMedium" style={{ margin: 10, color: "#3E92CC" }}>
                Already have an account?
            </Text>
            <Button
                mode="contained-tonal"
                style={{ margin: 10 }}
                onPress={() => {
                    router.replace("/SignIn");
                }}
            >
                Sign in to your account
            </Button>
            <Text variant="titleMedium" style={{ margin: 10, color: "#3E92CC" }}>
                Or just want to browse?
            </Text>
            <Button mode="outlined" style={{ margin: 10 }} onPress={handleGuestSignIn}>
                Sign in as guest
            </Button>
            {error ? (
                <Text variant="titleSmall" style={{ color: "red" }}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
}
