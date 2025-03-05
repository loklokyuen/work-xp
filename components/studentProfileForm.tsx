import { Button, IconButton, Text, TextInput } from "react-native-paper";
import ImageViewer from "./imageViewer";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { db } from "@/database/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserContext } from "@/context/UserContext";

export function ReadonlyStudentInfo({studentInfo}) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const placeHolderImage = require("../assets/images/background-image.png");

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    } else {
      alert("you did not select an image");
    }
  };

  return (
    <>
      <ImageViewer imgSource={selectedImage || placeHolderImage}></ImageViewer>
      <IconButton icon="camera" size={20} onPress={pickImageAsync} />
      <Text variant="titleMedium">Personal Statement:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.personalStatement}
      </Text>
      <Text variant="titleMedium">Experience:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.experience}
      </Text>
      <Text variant="titleMedium">Email:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.email}
      </Text>
      <Text variant="titleMedium">County:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.county}
      </Text>
      <Text variant="titleMedium">Subjects:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {studentInfo.subjects}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          onPress={() => {
            console.log("pressed");
          }}
        >
          Log out
        </Button>
      </View>
    </>
  );
}

export function EditableStudentInfo({studentInfo}) {
  const [bio, setBio] = useState<string>(studentInfo.personalStatement || "");
  const [experience, setExperience] = useState<string>(studentInfo.experience || "")
  const [email, setEmail] = useState<string>(studentInfo.email);
  const [county, setCounty] = useState<string>(studentInfo.county || "")
  const [rawSubjects, setRawSubjects] = useState<string>(studentInfo.subjects.join(","))
  const [subjects, setSubjects] =useState<string[]>(studentInfo.subjects)

  const {user} = useUserContext()

//    const function handleSave({bio, industry, phoneNum, email, address}) {
//     take the edited data and patch the database, then alert user to signify the patch was successful
//    }
const updatedStudentData = {
    personalStatement: bio,
    experience: experience,
    email: email,
    county: county,
    subjects: subjects
}

useEffect(() => {
    setSubjects(rawSubjects.split(","))
}, [rawSubjects])

const handleSave = async(updatedData) => {
    try {
        console.log(rawSubjects, subjects)
        const docRef = doc(db, "Student", user.uid)
        await updateDoc(docRef, updatedStudentData)
        alert("Changes have been saved")
    } catch (error){
        console.log(error)
    }
}

  return (
    <>
      <TextInput
        label="Personal Statement"
        mode="outlined"
        value={bio}
        onChangeText={(text) => setBio(text)}
      />
      <TextInput
        label="Experience"
        mode="outlined"
        value={experience}
        onChangeText={(text) => setExperience(text)}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
        <TextInput
        label="County"
        mode="outlined"
        value={county}
        onChangeText={(text) => setCounty(text)}
      />
       <TextInput
        label="Subjects (enter separated by commas)"
        mode="outlined"
        value={rawSubjects}
        onChangeText={(text) => setRawSubjects(text)}
      />
      <Button
        mode="contained-tonal"
        onPress={() => {
          handleSave(updatedStudentData);
        }}
      >
        Save Changes
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  data: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
