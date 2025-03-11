import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import styles from '@/app/styles';
interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    onConfirmAction: (reason: string) => void;
}

export const ReportModal= ({ open, onClose, title, onConfirmAction }: ReportModalProps) => {
    const [reason, setReason] = useState('');
    const handleConfirm = () => {
        onConfirmAction(reason)
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
            <Text variant='titleMedium' style={{ margin: 10, padding: 2}}>{title}</Text>
             <TextInput style={{ margin: 10, width: "90%" }}
                        secureTextEntry={true}
                        label="Reason"
                        mode="outlined"
                        value={reason}
                        multiline
                        onChangeText={(text) => setReason(text)}
                    />
            <View style={styles.buttonContainer}>
                    <Button  mode="outlined" onPress={onClose}  style={{ margin: 10}}>Cancel</Button>
                    <Button  mode="contained-tonal" onPress={handleConfirm} style={{ margin: 10}}>Confirm</Button>
            </View>
            </View>
            </View>
        </Modal>
    );
};
