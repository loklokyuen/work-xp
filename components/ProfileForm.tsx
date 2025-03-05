import { IconButton, Text, TextInput } from "react-native-paper";
import ImageViewer from "./imageViewer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, Platform } from "react-native";

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
    </>
  );
}

export function EditableUserInfo() {
  const [bio, setBio] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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
});
