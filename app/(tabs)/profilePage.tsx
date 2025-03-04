import { EditableUserInfo, ReadonlyUserInfo } from "@/components/ProfileForm";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function ProfilePage() {
    const [editButtonPressed, setEditButtonPressed] = useState<Boolean>(false)

  return (
    <SafeAreaView style={styles.container}>
      <Text>Header here</Text>
      <Button
        mode="contained-tonal"
        onPress={() => {setEditButtonPressed(!editButtonPressed)}}
      >
        Edit
      </Button>
      {editButtonPressed ? <ReadonlyUserInfo/> : <EditableUserInfo/>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  }
});
