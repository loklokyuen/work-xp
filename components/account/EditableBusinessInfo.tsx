import { Button, IconButton, Text, TextInput } from "react-native-paper";
import ImageViewer from "../imageViewer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { db } from "@/database/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserContext } from "@/context/UserContext";
import { updateBusinesInfo } from "@/database/business";

export function EditableBusinessInfo({businessInfo}: BusinessProps) {
    const [bio, setBio] = useState<string>(businessInfo.description || "");
    const [industry, setIndustry] = useState<string>(businessInfo.sector || "");
    const [phoneNum, setPhoneNum] = useState<string>(businessInfo.phoneNumber || "");
    const [email, setEmail] = useState<string>(businessInfo.email);
    const [address, setAddress] = useState<string>(businessInfo.address || "");
    const [county, setCounty] = useState<string>(businessInfo.county || "")
  
    const {user} = useUserContext()
  
  const handleSave = async() => {
      try {
            if (! user ) return;
            const isUpdateSuccess = await updateBusinesInfo(user.uid, email, county, bio, phoneNum, industry, address);
            if (isUpdateSuccess) {
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
        <TextInput style={{ margin: 10}}
          label="Company Bio"
          mode="outlined"
          value={bio}
          multiline={true}
          onChangeText={(text) => setBio(text)}
        />
        <TextInput style={{ margin: 10}}
          label="Industry"
          mode="outlined"
          value={industry}
          onChangeText={(text) => setIndustry(text)}
        />
        <TextInput style={{ margin: 10}}
          label="Telephone"
          mode="outlined"
          value={phoneNum}
          onChangeText={(text) => setPhoneNum(text)}
          keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
        />
        <TextInput style={{ margin: 10}}
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput style={{ margin: 10}}
          label="Address"
          mode="outlined"
          multiline={true}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
          <TextInput style={{ margin: 10}}
          label="County"
          mode="outlined"
          value={county}
          onChangeText={(text) => setCounty(text)}
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