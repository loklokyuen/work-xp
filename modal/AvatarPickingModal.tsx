import { useContext, useState } from "react";
import { Image, TouchableOpacity, Modal, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "@/app/styles";
import { auth } from "@/database/firebase";
import { updateUserProfileImage } from "@/database/user";
import { updateProfile } from "firebase/auth";
import { useUserContext } from "@/context/UserContext";
import { uploadImage, deleteImage } from "@/Cloudinary/cloudinaryWrapper";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SnackbarContext } from "@/context/SnackbarProvider";

interface AvatarPickingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AvatarPickingModal({
  open,
  onClose,
}: AvatarPickingModalProps) {
  const { showSnackbar } = useContext(SnackbarContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [error, setError] = useState("");
  const { user, setUser, accountType } = useUserContext();
  const avatars = [
    "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651937/samples/dessert-on-a-plate.jpg",
    "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651933/samples/balloons.jpg",
    "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651936/samples/cup-on-a-table.jpg",
  ];

  const { colors, fonts } = useTheme();

  async function handleImageSelection() {
    setSelectedAvatar("");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }
    async function handleImageUpload(){
        if (!image && !selectedAvatar){
            setError("Please select an image");
            return;
        }
        setLoading(true);
        let imageURL = '';
        if (image){
            imageURL = await uploadImage(image);
        } else {
            imageURL = selectedAvatar;
        }
        if ( auth.currentUser && accountType){
            updateProfile(auth.currentUser, {
                photoURL: imageURL,
            });
            const isUpdateSuccess = await updateUserProfileImage(auth.currentUser.uid, accountType, imageURL)
            setLoading(false);
            if (isUpdateSuccess) {
                showSnackbar("Avatar updated successfully", "success", 5000);
                // alert("Avatar updated successfully");
                setError("");
                if (user) {
                    const oldProfileImage = user.photoUrl;
                    if (oldProfileImage && oldProfileImage.includes("https://res.cloudinary.com/")) {
                        const publicId = oldProfileImage.split("/").pop()?.split(".")[0];
                        if (publicId) {
                            await deleteImage(publicId);
                        }
                    }
                    setUser({...user, photoUrl: imageURL || ""});
                }
                onClose();
            } else {
                showSnackbar("Failed to update avatar", "error", 5000);
                // alert("Failed to update avatar");
            }
        } 
        
        handleClose();
    }

  function handleClose() {
    setImage(null);
    setSelectedAvatar("");
    onClose();
  }
  if (loading) return <ActivityIndicator animating={true} />;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ margin: 10, fontWeight: "600", fontSize: 18 }}>
            Pick your Avatar
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: 200,
                  height: 200,
                  margin: 10,
                  borderRadius: 100,
                }}
              />
            ) : (
              avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedAvatar(avatar);
                  }}
                  style={{
                    margin: 2,
                    borderWidth: selectedAvatar === avatar ? 2 : 0,
                    borderColor: "blue",
                  }}
                >
                  <Image
                    key={avatar}
                    source={{ uri: avatar }}
                    style={{ width: 80, height: 80 }}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
            { image ? 
                <View>
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={()=>{
                            setImage(null);  setError('')
                        }} >Pick from our avatars</Button>
                        <Button mode="outlined" onPress={()=>{
                            setImage(null);  setError('')
                        }} >Clear Image</Button>
                    </View>
                    <Text style={{ color: 'grey', fontSize: 12, padding: 5, textAlign: 'center'}}>Please make sure your image is smaller than 10mb.</Text>
                </View>
            :
            <Button mode="contained" onPress={handleImageSelection} style={{ margin: 10}}>Upload your own image</Button>}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleClose}
              style={{
                margin: 10,
                backgroundColor: colors.errorContainer,
                borderWidth: 0,
                borderRadius: 8,
                paddingLeft: 5,
                paddingRight: 5,
              }}
              labelStyle={{
                fontFamily: "Lato",
                fontSize: 16,
                fontWeight: "normal",
                color: colors.onErrorContainer,
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained-tonal"
              onPress={handleImageUpload}
              style={{
                margin: 10,
                backgroundColor: colors.secondary,
                borderRadius: 8,
                paddingLeft: 5,
                paddingRight: 5,
              }}
              labelStyle={{
                fontFamily: "Lato",
                fontSize: 16,
                fontWeight: "normal",
                color: colors.onSecondary,
              }}
            >
              Submit
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
