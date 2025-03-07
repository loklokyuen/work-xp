import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import styles from '@/app/styles';
interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
    onChangePassword: (newPassword: string) => void;
}

export const ChangePasswordModal= ({ open, onClose, onChangePassword }: ChangePasswordModalProps) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        if (newPassword === confirmPassword) {
            onChangePassword(newPassword);
            onClose();
        } else {
            alert('New passwords do not match!');
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
            onRequestClose={onClose}
        >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text>Change Password</Text>
            <TextInput style={{ margin: 10 }}
                secureTextEntry={true}
                label="New Password"
                mode="outlined"
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
            />
            <TextInput style={{ margin: 10 }}
                secureTextEntry={true}
                label="Confirm New Password"
                mode="outlined"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
            />
            <View style={styles.buttonContainer}>
                    <Button  mode="outlined" onPress={onClose}  style={{ margin: 10}}>Cancel</Button>
                    <Button  mode="contained-tonal" onPress={handleSubmit} style={{ margin: 10}}>Submit</Button>
            </View>
            </View>
            </View>
        </Modal>
    );
};
