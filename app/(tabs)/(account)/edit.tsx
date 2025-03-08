import { EditStudent } from "../../../components/account/EditStudent";
import { EditBusiness } from "../../../components/account/EditBusiness";

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

export default function edit() {
    const [loading, setLoading] = useState<Boolean>(true);
    const [editMode, setEditMode] = useState<Boolean>(false);
    const [guestMode, setGuestMode] = useState<Boolean>(false);

    const [openAvatarPicker, setOpenAvatarPicker] = useState<boolean>(false);
    const [openLogout, setOpenLogout] = useState<boolean>(false);
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const placeHolderImage = require("@/assets/images/background-image.png");

    // function handleUpdateInfo() {
    //     if (!user) return;
    //     setLoading(true);
    //     if (accountType === "Business") {
    //         getBusinessById(user.uid).then((res) => {
    //             setBusinessInfo({
    //                 uid: res.uid,
    //                 displayName: res.displayName || "",
    //                 sector: res.sector || "",
    //                 photoUrl: res.photoUrl || "",
    //                 email: res.email || "",
    //                 address: res.address || "",
    //                 county: res.county || "",
    //                 description: res.description || "",
    //                 phoneNumber: res.phoneNumber || "",
    //                 opportunities: [],
    //                 reviews: [],
    //                 applications: [],
    //             });
    //             setLoading(false);
    //         });
    //     } else {
    //         getStudentById(user.uid).then((res) => {
    //             setStudentInfo({
    //                 uid: res.uid,
    //                 displayName: res.displayName || "",
    //                 photoUrl: res.photoUrl || "",
    //                 email: res.email || "",
    //                 county: res.county || "",
    //                 personalStatement: res.personalStatement || "",
    //                 applications: [],
    //                 reviews: [],
    //                 subjects: res.subjects || [],
    //                 experience: res.experience || "",
    //             });
    //             setLoading(false);
    //         });
    //     }
    // }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.scrollViewContent}>
                <View style={{ alignItems: "flex-end", marginRight: 20, position: "absolute", right: 2, top: 10 }}>
                    <Button
                        mode="contained-tonal"
                        onPress={() => {
                            router.push("/read");
                        }}
                    >
                        Back
                    </Button>
                </View>
                <View>
                    <Text variant="titleLarge" style={{ textAlign: "center", margin: 15 }}>
                        Profile
                    </Text>
                    {accountType === "Business" ? <EditBusiness /> : <EditStudent />}
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
