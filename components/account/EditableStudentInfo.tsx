import { Button, Chip, IconButton, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { useUserContext } from "@/context/UserContext";
import { updateStudentInfo } from "@/database/student";
import styles from "@/app/styles";

export function EditableStudentInfo({studentInfo}: StudentProps) {
    const [bio, setBio] = useState<string>(studentInfo.personalStatement || "");
    const [experience, setExperience] = useState<string>(studentInfo.experience || "")
    const [email, setEmail] = useState<string>(studentInfo.email);
    const [county, setCounty] = useState<string>(studentInfo.county || "")
    const [subjects, setSubjects] =useState<string[]>(studentInfo.subjects)
    const [newSubject, setNewSubject] = useState<string>("")
    const {user} = useUserContext()
  
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
  const handleDeleteSubject = (subject: string) => {
    console.log("deleting", subject);
    
    const newSubjects = subjects.filter((s) => s !== subject)
    setSubjects(newSubjects)
  }
    return (
      <>
        <TextInput  style={{ margin: 10}}
          label="Personal Statement"
          mode="outlined"
          multiline
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
        <Text variant="titleSmall" style={{ marginHorizontal: 20}}>Subjects:</Text>

        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10}}>
          {subjects.map((subject) => {
            return <Chip key={subject} style={{ margin: 3 }} closeIcon="close" onClose={()=>{handleDeleteSubject(subject)}}>{subject}</Chip>
            })
          }
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10, justifyContent: 'center'}}>

         <TextInput style={{ margin: 5, width: "60%"}} dense
          label="Add a subject" 
          mode="outlined"
          value={newSubject}
          onChangeText={(text) => setNewSubject(text)}
        />
          <Button style={{ margin: 10, justifyContent: 'center'}}
            mode="outlined"
            onPress={() => {
              setSubjects([...subjects, newSubject])
              setNewSubject("")
            }}
          >
            Add
          </Button>
        </View>
        <Button style={{ margin: 10}}
          mode="contained-tonal"
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </>
    );
  }