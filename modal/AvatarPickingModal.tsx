import { useState } from "react";
import { Image, TouchableOpacity, Modal, View, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import styles from "@/app/styles";
import { auth } from "@/database/firebase";
import { updateUserProfileImage } from "@/database/user";
import { updateProfile } from "firebase/auth";
import { useUserContext } from "@/context/UserContext";
import { uploadImage, deleteImage } from '@/Cloudinary/cloudinaryWrapper';
import { Button, IconButton, Text, TextInput } from "react-native-paper";

interface AvatarPickingModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AvatarPickingModal({ open, onClose }: AvatarPickingModalProps) {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');
    const [error, setError] = useState('');
    const { user, setUser, accountType } = useUserContext();
    const avatars = [
        "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651937/samples/dessert-on-a-plate.jpg",
        "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651933/samples/balloons.jpg",
        "https://res.cloudinary.com/dyu00bdps/image/upload/v1740651936/samples/cup-on-a-table.jpg",
    ];

    async function handleImageSelection(){
        setSelectedAvatar('')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1
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
            if (isUpdateSuccess) {
                alert("Avatar updated successfully");
                setError("");
                if (user) {
                    const oldProfileImage = user.photoUrl;
                    if (oldProfileImage && oldProfileImage.includes("https://res.cloudinary.com/")) {
                        const publicId = oldProfileImage.split("/").pop()?.split(".")[0];
                        if (publicId) {
                            await deleteImage(publicId);
                            alert("Old image deleted");
                        }
                    }
                    setUser({...user, photoUrl: imageURL || ""});
                }
                onClose();
            } else {
                alert("Failed to update avatar");
            }
        } else alert("No user signed in");
        
        onClose();
        }
    
    return  <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={onClose}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={{ margin: 10}}>Pick your Avatar</Text>
            { image ? <Button mode="contained-tonal" onPress={()=>{
                setImage(null);  setError('')
            }} >Pick from our avatars</Button>:
            <Button mode="contained-tonal" onPress={handleImageSelection} style={{ margin: 10}}>Upload your own image</Button>}
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {image ? <Image source={{uri: image.uri}} style={{width: 200, height: 200}} /> :
                    avatars.map((avatar, index) => (
                        <TouchableOpacity key={index} onPress={() =>{
                        setSelectedAvatar(avatar)}}
                        style={{margin: 5, borderWidth: selectedAvatar === avatar ? 2 : 0, borderColor: 'blue'}}>
                            <Image key={avatar} source={{uri:avatar}} style={{width: 80, height: 80}} />
                        </TouchableOpacity>
                    ))
                }
            </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
                <View style={styles.buttonContainer}>
                    <Button  mode="contained-tonal" onPress={handleImageUpload} style={{ margin: 10}}>Submit</Button>
                    <Button  mode="contained-tonal" onPress={onClose} style={{ margin: 10}}>Cancel</Button>
                </View>
            </View>
        </View>
    </Modal>
}