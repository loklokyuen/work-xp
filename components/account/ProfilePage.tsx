import { ReadonlyBusinessInfo } from "@/components/account/ReadonlyBusinessInfo";
import { ReadonlyStudentInfo } from "@/components/account/ReadonlyStudentInfo";
import { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { getBusinessById } from "@/database/business";
import { useUserContext } from "@/context/UserContext";
import { getStudentById } from "@/database/student";
import { EditableBusinessInfo } from "./EditableBusinessInfo";
import { EditableStudentInfo } from "./EditableStudentInfo";
import { auth } from "@/database/firebase";
import styles from "@/app/styles";
import { updatePassword } from "firebase/auth";
import ImageViewer from "../imageViewer";
import AvatarPickingModal from "@/modal/AvatarPickingModal";
import { ChangePasswordModal } from "@/modal/ChangePasswordModal";

export default function ProfilePage() {
    const [loading, setLoading] = useState<Boolean>(true)
    const [editButtonPressed, setEditButtonPressed] = useState<Boolean>(false)
    const [businessInfo, setBusinessInfo] = useState<Business>()
    const [studentInfo, setStudentInfo] = useState<Student>()
    const [openAvatarPicker, setOpenAvatarPicker] = useState<boolean>(false)
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false)
    const {user, setUser, accountType, setAccountType} = useUserContext()
    const placeHolderImage = require("@/assets/images/background-image.png");

    useEffect(() => {
      if (!user) return;
      if(accountType === "Business"){
        getBusinessById(user.uid).then((res) => {
          if (res) setBusinessInfo(res)
          setLoading(false)
          })
      } else if (accountType === "Student"){
        getStudentById(user.uid).then((res) => {
          if (res) setStudentInfo(res)
          setLoading(false)
        })
      }
    }, [user])

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
    

    if (loading) return <Text>Loading...</Text>
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Profile</Text>
          <View style={{ alignItems: "flex-end", marginRight: 20, position: "absolute", right: 10, top: 10 }}>
            <Button
              mode="contained-tonal"
              onPress={() => {setEditButtonPressed(!editButtonPressed)}}
            >
              {editButtonPressed ? "Go back" : "Edit"}
            </Button>
          </View>
          {editButtonPressed? null:

          <View style={{alignItems: "center"}}>
          <ImageViewer imgSource={studentInfo?.photoUrl || businessInfo?.photoUrl || placeHolderImage} ></ImageViewer>
          <IconButton icon="camera" size={20} onPress={()=>setOpenAvatarPicker(!openAvatarPicker)} />
          <AvatarPickingModal open={openAvatarPicker} onClose={()=> setOpenAvatarPicker(false)}></AvatarPickingModal>
          </View>}

          {editButtonPressed ? businessInfo && <EditableBusinessInfo businessInfo={businessInfo}/> 
          : businessInfo && <ReadonlyBusinessInfo businessInfo={businessInfo}/>}
          {editButtonPressed? studentInfo && <EditableStudentInfo studentInfo={studentInfo}/> 
          : studentInfo && <ReadonlyStudentInfo studentInfo={studentInfo}/>}
          {editButtonPressed? null:
          <View style={styles.buttonContainer}>
          <Button style={{ margin: 5 }}
              mode="contained-tonal"
              onPress={()=>{ setOpenChangePassword(true)}}>
              Change Password
            </Button>
            <ChangePasswordModal open={openChangePassword} onClose={()=> setOpenChangePassword(false)} onChangePassword={handleChangePassword}></ChangePasswordModal>
            <Button  style={{ margin: 5 }}
              mode="contained-tonal"
              onPress={handleLogout}
            >
              Log out
            </Button>
          </View>}
        </ScrollView>
      </SafeAreaView>
    );
    
}

