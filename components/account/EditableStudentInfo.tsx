import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { useUserContext } from "@/context/UserContext";
import { updateStudentInfo } from "@/database/student";

export function EditableStudentInfo({studentInfo}: StudentProps) {
    const [bio, setBio] = useState<string>(studentInfo.personalStatement || "");
    const [experience, setExperience] = useState<string>(studentInfo.experience || "")
    const [email, setEmail] = useState<string>(studentInfo.email);
    const [county, setCounty] = useState<string>(studentInfo.county || "")
    const [rawSubjects, setRawSubjects] = useState<string>(studentInfo.subjects ? studentInfo.subjects.join(",") : "")
    const [subjects, setSubjects] =useState<string[]>(studentInfo.subjects)
  
    const {user} = useUserContext()
  

  useEffect(() => {
      setSubjects(rawSubjects.split(","))
  }, [rawSubjects])
  
  const handleSave = async() => {
      try {
          if (! user ) return;
          const isUpdateSuccess = await updateStudentInfo(user.uid, email, county, bio, experience, subjects);
          if (isUpdateSuccess){
            alert("Changes have been saved")
          } else {
            alert("Error updating profile")
          }
      } catch (error){
          console.log(error)
      }
  }
  
    return (
      <>
        <TextInput  style={{ margin: 10}}
          label="Personal Statement"
          mode="outlined"
          value={bio}
          onChangeText={(text) => setBio(text)}
        />
        <TextInput style={{ margin: 10}}
          label="Experience"
          mode="outlined"
          value={experience}
          onChangeText={(text) => setExperience(text)}
        />
        <TextInput style={{ margin: 10}}
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
          <TextInput style={{ margin: 10}}
          label="County"
          mode="outlined"
          value={county}
          onChangeText={(text) => setCounty(text)}
        />
         <TextInput style={{ margin: 10}}
          label="Subjects (enter separated by commas)"
          mode="outlined"
          value={rawSubjects}
          onChangeText={(text) => setRawSubjects(text)}
        />
        <Button style={{ margin: 10}}
          mode="contained-tonal"
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </>
    );
  }