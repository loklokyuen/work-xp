import {
  Button,
  Chip,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { useUserContext } from "@/context/UserContext";
import { updateStudentInfo } from "@/database/student";
import styles from "@/app/styles";

type StudentInfoProps = {
  studentInfo: Student;
  setChangesMade: (value: boolean) => void;
  onUpdateInfo: () => void;
};

export function EditableStudentInfo({
  studentInfo,
  onUpdateInfo,
  setChangesMade,
}: StudentInfoProps) {
  const [displayName, setDisplayName] = useState<string>(
    studentInfo.displayName || ""
  );
  const [bio, setBio] = useState<string>(studentInfo.personalStatement || "");
  const [experience, setExperience] = useState<string>(
    studentInfo.experience || ""
  );
  const [email, setEmail] = useState<string>(studentInfo.email);
  const [county, setCounty] = useState<string>(studentInfo.county || "");
  const [subjects, setSubjects] = useState<string[]>(studentInfo.subjects);
  const [newSubject, setNewSubject] = useState<string>("");
  const { user } = useUserContext();

  const { colors, fonts } = useTheme();

  const handleSave = async () => {
    try {
      if (!user) return;
      const isUpdateSuccess = await updateStudentInfo(
        user.uid,
        displayName,
        email,
        county,
        bio,
        experience,
        subjects
      );
      if (isUpdateSuccess) {
        alert("Changes have been saved");
        onUpdateInfo();
        setChangesMade(false);
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteSubject = (subject: string) => {
    setChangesMade(true);
    const newSubjects = subjects.filter((s) => s !== subject);
    setSubjects(newSubjects);
  };
  return (
    <>
      <TextInput
        style={{ margin: 10 }}
        label="Name"
        mode="outlined"
        value={displayName}
        onChangeText={(text) => {
          setDisplayName(text);
          setChangesMade(true);
        }}
      />
      <TextInput
        style={{ margin: 10 }}
        label="Personal Statement"
        mode="outlined"
        multiline
        value={bio}
        onChangeText={(text) => {
          setBio(text);
          setChangesMade(true);
        }}
      />
      <TextInput
        style={{ margin: 10 }}
        label="Experience"
        mode="outlined"
        value={experience}
        onChangeText={(text) => {
          setExperience(text);
          setChangesMade(true);
        }}
      />
      <TextInput
        style={{ margin: 10 }}
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setChangesMade(true);
        }}
        keyboardType="email-address"
      />
      <TextInput
        style={{ margin: 10 }}
        label="County"
        mode="outlined"
        value={county}
        onChangeText={(text) => {
          setCounty(text);
          setChangesMade(true);
        }}
      />
      <Text variant="titleSmall" style={{ marginHorizontal: 20 }}>
        Subjects:
      </Text>

      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 10, }}
      >
        {subjects.map((subject) => {
          return (
            <Chip
              key={subject}
              style={{ margin: 3 }}
              closeIcon="close"
              onClose={() => {
                handleDeleteSubject(subject);
              }}
            >
              {subject}
            </Chip>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // flexWrap: "wrap",
          marginHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <TextInput
          style={{ margin: 5, width: "70%", height: 40 }}
          dense
          label="Add a subject"
          mode="outlined"
          value={newSubject}
          onChangeText={(text) => {
            setNewSubject(text);
          }}
        />
        <Button
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 8,
            paddingHorizontal: 10, 
            height: 40, 
            justifyContent: "center",
          }}
          labelStyle={{
            fontFamily: "SpaceMono",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.tertiary,
          }}
          mode="contained-tonal"
          // mode="outlined"
          onPress={() => {
            setChangesMade(true);
            setSubjects([...subjects, newSubject]);
            setNewSubject("");
          }}
        >
          Add
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 8,
            paddingLeft: 5,
            paddingRight: 5,
            marginTop: 15,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "SpaceMono",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.tertiary,
          }}
          mode="contained-tonal"
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </View>
    </>
  );
}
