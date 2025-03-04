import { IconButton, Text } from "react-native-paper";
import ImageViewer from "./imageViewer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function ReadonlyUserInfo() {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(
        undefined
      );

    const placeHolderImage = require("../assets/images/background-image.png")

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
        <IconButton
    icon="camera"
    size={20}
    onPress={pickImageAsync}
  />
        <Text variant="titleMedium">Company Bio</Text>
        <Text variant="titleMedium">Industry</Text>
        <Text variant="titleMedium">Telephone</Text>
        <Text variant="titleMedium">Email</Text>
        <Text variant="titleMedium">Address</Text>
        </>
    )
}

export function EditableUserInfo() {
    return (
        <Text variant="displayLarge">Editable stuff</Text>
    )
}