import React, { useState } from "react";
import { Modal, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import styles from "@/app/styles";
interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onConfirmAction: () => void;
}

export const ConfirmationModal = ({
  open,
  onClose,
  title,
  onConfirmAction,
}: ConfirmActionModalProps) => {
  const handleConfirm = () => {
    onConfirmAction();
    onClose();
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
          <Text variant="titleMedium" style={{ margin: 10, padding: 2 }}>
            {title}
          </Text>
          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={onClose} style={{ margin: 10 }}>
              OK
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
