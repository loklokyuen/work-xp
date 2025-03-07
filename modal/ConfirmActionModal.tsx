import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import styles from '@/app/styles';
interface ConfirmActionModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    onConfirmAction: () => void;
}

export const ConfirmActionModal= ({ open, onClose, title, onConfirmAction }: ConfirmActionModalProps) => {
    const handleConfirm = () => {
        onConfirmAction()
        onClose()
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
            <Text variant='titleMedium' style={{ marginBottom: 10}}>Confirm {title}?</Text>
            <View style={styles.buttonContainer}>
                    <Button  mode="outlined" onPress={onClose}  style={{ margin: 10}}>Cancel</Button>
                    <Button  mode="contained-tonal" onPress={handleConfirm} style={{ margin: 10}}>Confirm</Button>
            </View>
            </View>
            </View>
        </Modal>
    );
};
