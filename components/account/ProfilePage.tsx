import { ReadonlyBusinessInfo } from "./ReadonlyBusinessInfo";
import { ReadonlyStudentInfo } from "./ReadonlyStudentInfo";
import { useEffect, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, IconButton, Text } from "react-native-paper";
import { getBusinessById } from "@/database/business";
import { setUserAccountType, useUserContext } from "@/context/UserContext";
import { getStudentById } from "@/database/student";
import { EditableBusinessInfo } from "./EditableBusinessInfo";
import { EditableStudentInfo } from "./EditableStudentInfo";
import { auth } from "@/database/firebase";
import styles from "@/app/styles";
import { updatePassword } from "firebase/auth";
import ImageViewer from "../expoComponents/imageViewer";
import AvatarPickingModal from "@/modal/AvatarPickingModal";
import { ChangePasswordModal } from "@/modal/ChangePasswordModal";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GuestModePrompt from "./GuestModePrompt";

export default function ProfilePage({ setIsNewUser, setIsExistingUser }: accountProps) {
    const [loading, setLoading] = useState<Boolean>(true);
    const [editMode, setEditMode] = useState<Boolean>(false);
    const [guestMode, setGuestMode] = useState<Boolean>(false);
    const [businessInfo, setBusinessInfo] = useState<Business>();
    const [studentInfo, setStudentInfo] = useState<Student>();
    const [openAvatarPicker, setOpenAvatarPicker] = useState<boolean>(false);
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const placeHolderImage = require("@/assets/images/background-image.png");

    useEffect(() => {
        if (!user) return;
        setGuestMode(false);
        // 'Qf1ha917fUU7oDmACzZ3msxI5Yk2'
         getBusinessById(user.uid).then((res) => {
           console.log(res);
            if (res) { 
                setBusinessInfo({ uid: res.uid,
                    displayName: res.displayName || "",
                    sector: res.sector || "",
                    photoUrl: res.photoUrl || "",
                    email: res.email || "",
                    address: res.address || "",
                    county: res.county || "",
                    description: res.description || "",
                    phoneNumber: res.phoneNumber || "",
                    opportunities: [],
                    reviews: [],
                    applications: []
                });
                setAccountType("Business");
                setUserAccountType("Business");
                setLoading(false);
                setGuestMode(false);
                return true;
            } else return false;
            
        }).then((userFound) => {
            if (!userFound){
                return getStudentById(user.uid).then((res) => {
                    if (res) {
                        setAccountType("Student");
                        setUserAccountType("Student");
                        setStudentInfo({ uid: res.uid,
                            displayName: res.displayName || "",
                            photoUrl: res.photoUrl || "",
                            email: res.email || "",
                            county: res.county || "",
                            personalStatement: res.personalStatement || "",
                            applications: [],
                            reviews: [],
                            subjects: res.subjects || [],
                            experience: res.experience || ""});
                        setLoading(false);
                        setGuestMode(false);
                        return true;
                    } else return false
                })
            } else return true;
        }).then((userFound) => {
            if (!userFound){
                setGuestMode(true);
                setLoading(false);
            }
        });
    }, [user]);

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                setUser(null);
                setAccountType(null);
            })
            .catch(() => {
                // setError(error.message);
            });
    };
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

    const clearGuestMode = (isNewUser: boolean) => {
        setGuestMode(false);
        setIsNewUser(isNewUser);
        setIsExistingUser(!isNewUser);
        setAccountType(null);
        setUser(null);
    };

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.scrollViewContent}>
                <Text variant="titleLarge" style={{ textAlign: "center", margin: 15 }}>
                    {guestMode ? "Guest" : "Profile"}
                </Text>
                {guestMode && <GuestModePrompt clearGuestMode={clearGuestMode} />}
                {!guestMode && (
                    <View style={{ alignItems: "flex-end", marginRight: 20, position: "absolute", right: 2, top: 10 }}>
                        <Button
                            mode="contained-tonal"
                            onPress={() => {
                                setEditMode(!editMode);
                            }}
                        >
                            {editMode ? "Back" : "Edit"}
                        </Button>
                    </View>
                )}
                {!editMode && !guestMode && (
                    <View style={styles.centeredView}>
                        <View style={{ alignItems: "center", position: "relative" }}>
                            <ImageViewer imgSource={studentInfo?.photoUrl || businessInfo?.photoUrl || placeHolderImage}></ImageViewer>
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
                )}
                {!editMode && !guestMode && (
                    <Text variant="titleMedium" style={{ textAlign: "center", margin: 10 }}>
                        {studentInfo?.displayName || businessInfo?.displayName}
                    </Text>
                )}
                {editMode ? (
                    businessInfo ? (
                        <EditableBusinessInfo businessInfo={businessInfo} />
                    ) : (
                        studentInfo && <EditableStudentInfo studentInfo={studentInfo} />
                    )
                ) : businessInfo ? (
                    <ReadonlyBusinessInfo businessInfo={businessInfo} />
                ) : (
                    studentInfo && <ReadonlyStudentInfo studentInfo={studentInfo} />
                )}
                {!editMode && !guestMode && (
                    <View style={styles.buttonContainer}>
                        <Button
                            style={{ margin: 5 }}
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
                        <Button style={{ margin: 5 }} mode="outlined" onPress={handleLogout}>
                            Log out
                        </Button>
                    </View>
                )}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
