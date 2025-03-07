import Chat from "@/components/chatComponent";
import { setUserAccountType, useUserContext } from "@/context/UserContext";
import {  View } from "react-native";
import {  useState } from "react";
import {  auth } from "@/database/firebase";
import { Button, Text } from "react-native-paper";
import { router } from "expo-router";
import SignIn from "@/components/account/SignIn";
import CreateAccount from "../../components/account/CreateAccount";
import ProfilePage from "@/components/account/ProfilePage";
import { signInAnonymously } from "firebase/auth";

export default function AccountScreen() {
    const { user, setUser, setAccountType } = useUserContext();
    const [isNewUser, setIsNewUser] = useState<boolean>(false);
    const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    if (user) {
        return <ProfilePage setIsNewUser={setIsNewUser} setIsExistingUser={setIsExistingUser}/>;
    }

    if (isNewUser) {
        return <CreateAccount setIsNewUser={setIsNewUser} setIsExistingUser={setIsExistingUser}/>;
    } 
    if (isExistingUser) {
        return <SignIn setIsNewUser={setIsNewUser} setIsExistingUser={setIsExistingUser}/>;
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
        <View style={{ backgroundColor: "#FFFAFF", flex: 1, justifyContent: "center", alignItems: "center" }}>
            {/* <Text variant="titleLarge" style={{ margin: 20 }}>
                Are you a business or a student user?
            </Text>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
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
            </View> */}
              <Text variant="titleLarge" style={{ margin: 10, color: "#3E92CC" }}>
                Welcome to Work-XP!
            </Text>
            <Text variant="titleMedium" style={{ margin: 20, color: "#07070A", textAlign: "center" }}>
            Find the work experience opportunity that's perfect for you, from the comfort of your phone!
            </Text>
            <Text variant="titleMedium" style={{ margin: 10, color: "#3E92CC" }}>
                New to the app?
            </Text>
            <Button mode="contained-tonal" style={{ margin: 10 }} onPress={()=>{
                setIsNewUser(true);}}>
                Create an account
            </Button>
            <Text variant="titleMedium" style={{ margin: 10, color: "#3E92CC" }}>
                Already have an account?
            </Text>
            <Button mode="contained-tonal" style={{ margin: 10 }} onPress={()=>{
                setIsExistingUser(true);}}>
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