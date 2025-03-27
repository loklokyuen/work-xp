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
interface ConfirmActionModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	onConfirmAction: () => void;
}

export const ConfirmActionModal = ({
	open,
	onClose,
	title,
	onConfirmAction,
}: ConfirmActionModalProps) => {
	const handleConfirm = () => {
		onConfirmAction();
		onClose();
	};
	const { colors, fonts } = useTheme();

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={open}
			onRequestClose={onClose}>
			<View style={styles.modalContainerView}>
				<View style={styles.modalView}>
					<Text
						variant="titleMedium"
						style={{ margin: 10, padding: 2, maxWidth: 280 }}>
						{title}
					</Text>
					<View style={styles.buttonContainer}>
						<Button
							mode="outlined"
							onPress={onClose}
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
							onPress={handleConfirm}
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
							}}>
							Confirm
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};
