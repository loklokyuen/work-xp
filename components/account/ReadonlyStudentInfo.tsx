import { Button, IconButton, Text, TextInput } from "react-native-paper";
import ImageViewer from "../imageViewer";
import { useEffect, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import AvatarPickingModal from "@/modal/AvatarPickingModal";
import styles from "@/app/styles";

export function ReadonlyStudentInfo({studentInfo}: StudentProps) {
  const [open, setOpen] = useState<boolean>(false)

  const placeHolderImage = require("@/assets/images/background-image.png");

  if (studentInfo)
  return (
    <View style={styles.container}>

      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Personal Statement:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.personalStatement}
      </Text>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Experience:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.experience}
      </Text>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Email:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.email}
      </Text>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>County:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.county}
      </Text>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Subjects:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.subjects.join(", ")}
      </Text>
    </View>
  );
}


