import Chat from "@/components/chatComponent";
import { setUserAccountType, useUserContext } from "@/context/UserContext";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db, auth } from "@/database/firebase";
import { Button, Text } from "react-native-paper";
import { router } from "expo-router";
import SignIn from "@/components/account/SignIn";
import CreateAccount from "../../components/account/CreateAccount";
import ProfilePage from "@/components/account/ProfilePage";
import { signInAnonymously } from "firebase/auth";

export default function AccountScreen() {
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const [isNewUser, setIsNewUser] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    if (user) {
        return <ProfilePage setIsNewUser={setIsNewUser} />;
    }

    if (accountType) {
        if (isNewUser) {
            return <CreateAccount setIsNewUser={setIsNewUser} />;
        } else {
            return <SignIn setIsNewUser={setIsNewUser} />;
        }
    }

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
        <View style={{ backgroundColor: "#fff", flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text variant="titleLarge" style={{ margin: 20 }}>
                Are you a business or a student user?
            </Text>
            <Button
                mode="contained-tonal"
                onPress={() => {
                    setAccountType("Student");
                }}
            >
                Student
            </Button>
            <Text variant="titleLarge" style={{ margin: 10 }}>
                OR
            </Text>
            <Button
                mode="contained-tonal"
                onPress={() => {
                    setAccountType("Business");
                }}
            >
                Business
            </Button>
            {error ? (
                <Text variant="titleSmall" style={{ color: "red" }}>
                    {error}
                </Text>
            ) : null}
            <Button mode="outlined" style={{ marginTop: 40 }} onPress={handleGuestSignIn}>
                Sign in as guest
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
