import { ReadBusiness } from "../../../components/account/ReadBusiness";
import { ReadStudent } from "../../../components/account/ReadStudent";

import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { ActivityIndicator, Button, IconButton, Text } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImageViewer from "../../../components/expoComponents/imageViewer";
import styles from "@/app/styles";

import { auth } from "@/database/firebase";
import { getBusinessById } from "@/database/business";
import { getStudentById } from "@/database/student";
import { updatePassword } from "firebase/auth";

import { setUserAccountType, useUserContext } from "@/context/UserContext";

import AvatarPickingModal from "@/modal/AvatarPickingModal";
import { ChangePasswordModal } from "@/modal/ChangePasswordModal";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";

import { router } from "expo-router";

export default function read() {
    const [loading, setLoading] = useState<Boolean>(true);
    const [editMode, setEditMode] = useState<Boolean>(false);
    const [guestMode, setGuestMode] = useState<Boolean>(false);

    const [openAvatarPicker, setOpenAvatarPicker] = useState<boolean>(false);
    const [openLogout, setOpenLogout] = useState<boolean>(false);
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const placeHolderImage = require("@/assets/images/background-image.png");

    const handleChangePassword = (newPassword: string) => {
        const user = auth.currentUser;
        if (user) {
            updatePassword(user, newPassword)
                .then(() => {
                    alert("Password changed successfully!");
                })
                .catch((error) => {
                    // setError(error.message);
                });
        }
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                setUser(null);
                setAccountType(null);
                setUserAccountType("");
                router.replace("/(auth)");
            })
            .catch(() => {
                // setError(error.message);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.scrollViewContent}>
                <View>
                    <Text variant="titleLarge" style={{ textAlign: "center", margin: 15 }}>
                        Profile
                    </Text>
                    <View style={{ alignItems: "flex-end", marginRight: 20, position: "absolute", right: 2, top: 10 }}>
                        <Button
                            mode="contained-tonal"
                            onPress={() => {
                                router.push({
                                    pathname: "./edit",
                                });
                            }}
                        >
                            Edit
                        </Button>
                    </View>
                    <View style={styles.centeredView}>
                        <View style={{ alignItems: "center", position: "relative" }}>
                            <ImageViewer imgSource={user?.photoUrl || placeHolderImage}></ImageViewer>
                            <IconButton
                                icon="camera"
                                size={20}
                                onPress={() => setOpenAvatarPicker(!openAvatarPicker)}
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 5,
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    borderRadius: 150,
                                    padding: 5,
                                }}
                            />
                            <AvatarPickingModal open={openAvatarPicker} onClose={() => setOpenAvatarPicker(false)}></AvatarPickingModal>
                        </View>
                    </View>
                    <Text variant="titleMedium" style={{ textAlign: "center", margin: 10 }}>
                        {user?.displayName}
                    </Text>
                    {accountType === "Business" ? <ReadBusiness /> : <ReadStudent />}
                    <View style={styles.buttonContainer}>
                        <Button
                            style={{ margin: 5, backgroundColor: "#f0f0f0" }}
                            mode="outlined"
                            onPress={() => {
                                setOpenChangePassword(true);
                            }}
                        >
                            Change Password
                        </Button>
                        <ChangePasswordModal
                            open={openChangePassword}
                            onClose={() => setOpenChangePassword(false)}
                            onChangePassword={handleChangePassword}
                        ></ChangePasswordModal>
                        <Button style={{ margin: 5, backgroundColor: "#f0f0f0" }} mode="outlined" onPress={() => setOpenLogout(true)}>
                            Log out
                        </Button>
                        <ConfirmActionModal open={openLogout} onClose={() => setOpenLogout(false)} title="logout" onConfirmAction={handleLogout} />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
