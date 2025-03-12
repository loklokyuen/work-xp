import React, { useState } from "react";
import { Modal, View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import styles from "@/app/styles";
interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onChangePassword: (oldPassword: string, newPassword: string) => void;
}

export const ChangePasswordModal = ({
  open,
  onClose,
  onChangePassword,
}: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { colors, fonts } = useTheme();
  const handleSubmit = () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      alert("Please fill in all fields");
    } else if (oldPassword === newPassword) {
      alert("New password must be different from old password!");
    } else if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
    } else if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
    } else if (
      newPassword.toUpperCase() === newPassword ||
      newPassword.toLowerCase() === newPassword
    ) {
      alert(
        "Password must contain at least one uppercase and one lowercase letter"
      );
    } else {
      onChangePassword(oldPassword, newPassword);
      onClose();
    }
  };
  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text variant="titleMedium" style={{ margin: 10, padding: 2 }}>Change Password 🔑</Text>
          <TextInput
            style={{ margin: 10, maxHeight: 50, width: 200 }}
            secureTextEntry={true}
            label="Old Password"
            mode="outlined"
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
          />
          <TextInput
            style={{ margin: 10, maxHeight: 50, width: 200 }}
            secureTextEntry={true}
            label="New Password"
            mode="outlined"
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <TextInput
            style={{ margin: 10, maxHeight: 50, width: 200 }}
            secureTextEntry={true}
            label="Confirm New Password"
            mode="outlined"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
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
              }}>
    
              Cancel
            </Button>
            <Button
              mode="contained-tonal"
              onPress={handleSubmit}
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
};
