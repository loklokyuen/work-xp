import { ReadBusiness } from "../../../components/account/ReadBusiness";
import { ReadStudent } from "../../../components/account/ReadStudent";
import { EditBusiness } from "../../../components/account/EditBusiness";
import { EditStudent } from "../../../components/account/EditStudent";
import GuestModePrompt from "./Guest";

import ImageViewer from "../../../components/expoComponents/imageViewer";
import styles from "@/app/styles";

import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { ActivityIndicator, Button, IconButton, Text } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { auth } from "@/database/firebase";
import { getBusinessById } from "@/database/business";
import { getStudentById } from "@/database/student";
import { updatePassword } from "firebase/auth";

import { setUserAccountType, useUserContext } from "@/context/UserContext";

import AvatarPickingModal from "@/modal/AvatarPickingModal";
import { ChangePasswordModal } from "@/modal/ChangePasswordModal";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";

import { router } from "expo-router";

export default function ProfilePage() {
    const [loading, setLoading] = useState<Boolean>(true);
    const [editMode, setEditMode] = useState<Boolean>(false);
    const [guestMode, setGuestMode] = useState<Boolean>(false);

    const [businessInfo, setBusinessInfo] = useState<Business>();
    const [studentInfo, setStudentInfo] = useState<Student>();
    const [openAvatarPicker, setOpenAvatarPicker] = useState<boolean>(false);
    const [openLogout, setOpenLogout] = useState<boolean>(false);
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const { user, setUser, accountType, setAccountType } = useUserContext();
    const placeHolderImage = require("@/assets/images/background-image.png");

    // useEffect(() => {
    //     if (!user) return;
    //     setGuestMode(false);
    //     getBusinessById(user.uid)
    //         .then((res) => {
    //             if (res) {
    //                 setBusinessInfo({
    //                     uid: res.uid,
    //                     displayName: res.displayName || "",
    //                     sector: res.sector || "",
    //                     photoUrl: res.photoUrl || "",
    //                     email: res.email || "",
    //                     address: res.address || "",
    //                     county: res.county || "",
    //                     description: res.description || "",
    //                     phoneNumber: res.phoneNumber || "",
    //                     opportunities: [],
    //                     reviews: [],
    //                     applications: [],
    //                 });
    //                 setAccountType("Business");
    //                 setUserAccountType("Business");
    //                 setLoading(false);
    //                 setGuestMode(false);
    //                 return true;
    //             } else return false;
    //         })
    //         .then((userFound) => {
    //             if (!userFound) {
    //                 return getStudentById(user.uid).then((res) => {
    //                     if (res) {
    //                         setAccountType("Student");
    //                         setUserAccountType("Student");
    //                         setStudentInfo({
    //                             uid: res.uid,
    //                             displayName: res.displayName || "",
    //                             photoUrl: res.photoUrl || "",
    //                             email: res.email || "",
    //                             county: res.county || "",
    //                             personalStatement: res.personalStatement || "",
    //                             applications: [],
    //                             reviews: [],
    //                             subjects: res.subjects || [],
    //                             experience: res.experience || "",
    //                         });
    //                         setLoading(false);
    //                         setGuestMode(false);
    //                         return true;
    //                     } else return false;
    //                 });
    //             } else return true;
    //         })
    //         .then((userFound) => {
    //             if (!userFound) {
    //                 setGuestMode(true);
    //                 setLoading(false);
    //             }
    //         });
    // }, [user]);

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

    // const handleLogout = () => {
    //     auth.signOut()
    //         .then(() => {
    //             setUser(null);
    //             setAccountType(null);
    //             setUserAccountType("");
    //             router.replace("/(auth)");
    //         })
    //         .catch(() => {
    //             // setError(error.message);
    //         });
    // };
    // const handleChangePassword = (newPassword: string) => {
    //     const user = auth.currentUser;
    //     if (user) {
    //         updatePassword(user, newPassword)
    //             .then(() => {
    //                 alert("Password changed successfully!");
    //             })
    //             .catch((error) => {
    //                 // setError(error.message);
    //             });
    //     }
    // };

    useEffect(() => {
        console.log(accountType);
        console.log("hello");
    }, []);

    if (accountType) {
        console.log("read");
        router.replace("/read");
    }
    // return (
    //     // <SafeAreaView style={styles.container}>
    //     //     <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.scrollViewContent}>
    //             {/* <Text variant="titleLarge" style={{ textAlign: "center", margin: 15 }}>
    //                 {guestMode ? "Guest" : "Profile"}
    //             </Text> */}
    //             {/* {guestMode && <GuestModePrompt />} */}
    //             {/* {!guestMode && (
    //                 <View style={{ alignItems: "flex-end", marginRight: 20, position: "absolute", right: 2, top: 10 }}>
    //                     <Button
    //                         mode="contained-tonal"
    //                         onPress={() => {
    //                             setEditMode(!editMode);
    //                         }}
    //                     >
    //                         {editMode ? "Back" : "Edit"}
    //                     </Button>
    //                 </View>
    //             )} */}
    //             {/* {!editMode && !guestMode && (
    //                 <View style={styles.centeredView}>
    //                     <View style={{ alignItems: "center", position: "relative" }}>
    //                         <ImageViewer imgSource={studentInfo?.photoUrl || businessInfo?.photoUrl || placeHolderImage}></ImageViewer>
    //                         <IconButton
    //                             icon="camera"
    //                             size={20}
    //                             onPress={() => setOpenAvatarPicker(!openAvatarPicker)}
    //                             style={{
    //                                 position: "absolute",
    //                                 bottom: 0,
    //                                 right: 5,
    //                                 backgroundColor: "rgba(255, 255, 255, 0.8)",
    //                                 borderRadius: 150,
    //                                 padding: 5,
    //                             }}
    //                         />
    //                         <AvatarPickingModal open={openAvatarPicker} onClose={() => setOpenAvatarPicker(false)}></AvatarPickingModal>
    //                     </View>
    //                 </View>
    //             )} */}
    //             {/* {!editMode && !guestMode && (
    //                 <Text variant="titleMedium" style={{ textAlign: "center", margin: 10 }}>
    //                     {studentInfo?.displayName || businessInfo?.displayName}
    //                 </Text>
    //             )} */}
    //             {/* {editMode ? (
    //                 businessInfo ? (
    //                     <EditBusiness businessInfo={businessInfo} onUpdateInfo={handleUpdateInfo} />
    //                 ) : (
    //                     studentInfo && <EditStudent studentInfo={studentInfo} onUpdateInfo={handleUpdateInfo} />
    //                 )
    //             ) : businessInfo ? (
    //                 <ReadBusiness businessInfo={businessInfo} />
    //             ) : (
    //                 studentInfo && <ReadStudent studentInfo={studentInfo} />
    //             )} */}
    //             {/* {!editMode && !guestMode && (
    //                 <View style={styles.buttonContainer}>
    //                     <Button
    //                         style={{ margin: 5, backgroundColor: "#f0f0f0" }}
    //                         mode="outlined"
    //                         onPress={() => {
    //                             setOpenChangePassword(true);
    //                         }}
    //                     >
    //                         Change Password
    //                     </Button>
    //                     <ChangePasswordModal
    //                         open={openChangePassword}
    //                         onClose={() => setOpenChangePassword(false)}
    //                         onChangePassword={handleChangePassword}
    //                     ></ChangePasswordModal>
    //                     <Button style={{ margin: 5, backgroundColor: "#f0f0f0" }} mode="outlined" onPress={() => setOpenLogout(true)}>
    //                         Log out
    //                     </Button>
    //                     <ConfirmActionModal open={openLogout} onClose={() => setOpenLogout(false)} title="logout" onConfirmAction={handleLogout} />
    //                 </View>
    //             )} */}
    //         {/* </KeyboardAwareScrollView>
    //     </SafeAreaView> */}
    // );
}
