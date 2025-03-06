import { EditableUserInfo, ReadonlyUserInfo } from "@/components/ProfileForm";
import { EditableStudentInfo, ReadonlyStudentInfo } from "@/components/studentProfileForm";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { getBusinessById } from "@/database/business";
import { useUserContext } from "@/context/UserContext";
import { getStudentById } from "@/database/student";

export default function ProfilePage() {
    const [editButtonPressed, setEditButtonPressed] = useState<Boolean>(false)
    const [businessInfo, setBusinessInfo] = useState<object>({})
    const [studentInfo, setStudentInfo] = useState<object>({})
    const {user, accountType} = useUserContext()

    useEffect(() => {
        if(accountType === "Business"){
            getBusinessById(user.uid).then((res) => {
                setBusinessInfo(res)
            })
        } else if (accountType === "Student"){
          getStudentById(user.uid).then((res) => {
            setStudentInfo(res)
          })
        }
    }, [editButtonPressed])

    if (accountType === "Business"){
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text>Header here</Text>
          <Button
            mode="contained-tonal"
            onPress={() => {setEditButtonPressed(!editButtonPressed)}}
          >
            {editButtonPressed ? "Go back" : "Edit"}
          </Button>
          {editButtonPressed ?  <EditableUserInfo businessInfo={businessInfo}/> : <ReadonlyUserInfo businessInfo={businessInfo}/>}
          </ScrollView>
        </SafeAreaView>
      );
    } else if (accountType === "Student"){
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text>Header here</Text>
          <Button
            mode="contained-tonal"
            onPress={() => {setEditButtonPressed(!editButtonPressed)}}
          >
            {editButtonPressed ? "Go back" : "Edit"}
          </Button>
          {editButtonPressed ?  <EditableStudentInfo studentInfo={studentInfo}/> : <ReadonlyStudentInfo studentInfo={studentInfo}/>}
          </ScrollView>
        </SafeAreaView>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 18,
  },
  scrollViewContent: {
    paddingBottom: 75,
  },
});
