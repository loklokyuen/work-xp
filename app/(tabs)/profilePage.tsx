import { EditableUserInfo, ReadonlyUserInfo } from "@/components/ProfileForm";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { getBusinessById } from "@/database/business";
import { useUserContext } from "@/context/UserContext";

export default function ProfilePage() {
    const [editButtonPressed, setEditButtonPressed] = useState<Boolean>(false)
    const [businessInfo, setBusinessInfo] = useState<object>({})
    const {user} = useUserContext()

    useEffect(() => {
        if(user?.uid){
            getBusinessById(user.uid).then((res) => {
                setBusinessInfo(res)
            })
        }
    }, [editButtonPressed])

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
