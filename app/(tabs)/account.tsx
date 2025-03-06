import { useUserContext } from "@/context/UserContext";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db, auth } from "@/database/firebase";
import { Button } from "react-native";
import { router } from "expo-router";
import SignIn from "@/components/account/SignIn";
import CreateAccount from "../../components/account/CreateAccount";
import ProfilePage from "@/components/account/ProfilePage";

export default function AccountScreen() {
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const [isNewUser, setIsNewUser] = useState<boolean>(true);
    if (user) {
        return <ProfilePage />;
    }

    if (accountType) {
        if (isNewUser) {
            return <CreateAccount setIsNewUser={setIsNewUser} />;
        } else {
            return <SignIn setIsNewUser={setIsNewUser} />;
        }
    }

    return (
        <View style={{ backgroundColor: "#fff", flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Are you a business or student user?</Text>
            <Button
                title="Student"
                onPress={() => {
                    setAccountType("Student");
                }}
            />
            <Text> OR</Text>
            <Button
                title="Business"
                onPress={() => {
                    setAccountType("Business");
                }}
            />
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
