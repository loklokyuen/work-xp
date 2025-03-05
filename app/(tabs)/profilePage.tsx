import { EditableUserInfo, ReadonlyUserInfo } from "@/components/ProfileForm";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function ProfilePage() {
    const [editButtonPressed, setEditButtonPressed] = useState<Boolean>(false)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView >
      <Text>Header here</Text>
      <Button
        mode="contained-tonal"
        onPress={() => {setEditButtonPressed(!editButtonPressed)}}
      >
        Edit
      </Button>
      {editButtonPressed ?  <EditableUserInfo/> : <ReadonlyUserInfo/>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
