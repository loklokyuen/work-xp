import Chat from "@/components/chatComponent";
import { useUserContext } from "@/context/UserContext";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/database/firebase";
import { Button } from "react-native";
import SignIn from "@/components/account/sign-in";
import CreateAccount from "@/components/account/create-account";
import SuccessSignIn from "@/components/account/success-sign-in";

export default function AccountScreen() {
    const { user, setUser } = useUserContext();
    const [account, setAccount] = useState<boolean>(true);

    if (user.uid) {
        return <SuccessSignIn />;
    } else {
        if (account) return <SignIn setAccount={setAccount} />;
        else return <CreateAccount setAccount={setAccount} />;
    }
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
