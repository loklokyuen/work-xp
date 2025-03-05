import { Button, IconButton, Text, TextInput } from "react-native-paper";
import ImageViewer from "./imageViewer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { db } from "@/database/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserContext } from "@/context/UserContext";

export function ReadonlyUserInfo() {
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
      <Text variant="titleMedium">Company Bio:</Text>
      <Text variant="titleSmall" style={styles.data}>
        Fill this with data from database
      </Text>
      <Text variant="titleMedium">Industry:</Text>
      <Text variant="titleSmall" style={styles.data}>
        Fill this with data from database
      </Text>
      <Text variant="titleMedium">Telephone:</Text>
      <Text variant="titleSmall" style={styles.data}>
        Fill this with data from database
      </Text>
      <Text variant="titleMedium">Email:</Text>
      <Text variant="titleSmall" style={styles.data}>
        Fill this with data from database
      </Text>
      <Text variant="titleMedium">Address:</Text>
      <Text variant="titleSmall" style={styles.data}>
        Fill this with data from database
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          onPress={() => {
            console.log("pressed");
          }}
        >
          View ads
        </Button>
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

export function EditableUserInfo() {
  const [bio, setBio] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [county, setCounty] = useState<string>("")

  const {user} = useUserContext()

//    const function handleSave({bio, industry, phoneNum, email, address}) {
//     take the edited data and patch the database, then alert user to signify the patch was successful
//    }
const updatedData = {
    description: bio,
    sector: industry,
    address: address,
    county: county,
}
console.log(updatedData)

const handleSave = async(updatedData) => {
    try {
        const docRef = doc(db, "Business", user.uid)
        await updateDoc(docRef, updatedData)
    } catch (error){
        console.log(error)
    }
}

  return (
    <>
      <TextInput
        label="Company Bio"
        mode="outlined"
        value={bio}
        onChangeText={(text) => setBio(text)}
      />
      <TextInput
        label="Industry"
        mode="outlined"
        value={industry}
        onChangeText={(text) => setIndustry(text)}
      />
      <TextInput
        label="Telephone"
        mode="outlined"
        value={phoneNum}
        onChangeText={(text) => setPhoneNum(text)}
        keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        label="Address"
        mode="outlined"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />
        <TextInput
        label="County"
        mode="outlined"
        value={county}
        onChangeText={(text) => setCounty(text)}
      />
      <Button
        mode="contained-tonal"
        onPress={() => {
          handleSave(updatedData);
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
