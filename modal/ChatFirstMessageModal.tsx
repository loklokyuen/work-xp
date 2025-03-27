import React, { useContext, useState } from "react";
import { Modal, View } from "react-native";
import {
	Button,
	IconButton,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import styles from "@/app/styles";
import { SnackbarContext } from "@/context/SnackbarProvider";
interface ChatFirstMessageModalProps {
	open: boolean;
	reciever: string;
	onClose: () => void;
	onConfirmAction: (content: string) => void;
}

export const ChatFirstMessageModal = ({
	open,
	reciever,
	onClose,
	onConfirmAction,
}: ChatFirstMessageModalProps) => {
	const { showSnackbar } = useContext(SnackbarContext);

	const [firstMessage, setFirstMessage] = useState("");
	const handleSend = () => {
		if (!firstMessage || firstMessage === "") {
			showSnackbar("Please enter a message", "error", 5000);
			// alert("Please enter a message");
			return;
		}
		onConfirmAction(firstMessage);
		setFirstMessage("");
		onClose();
	};

	const { colors, fonts } = useTheme();

	return (
		<Modal
			style={{ maxWidth: "90%" }}
			animationType="fade"
			transparent={true}
			visible={open}
			onRequestClose={onClose}>
			<View style={styles.modalContainerView}>
				<View style={styles.modalView}>
					<Text
						variant="titleMedium"
						style={{
							margin: 10,
							padding: 2,
							flexWrap: "wrap",
							maxWidth: "80%",
						}}>
						Send your first message to {reciever}
					</Text>
					<TextInput
						style={{ margin: 10, width: "90%" }}
						secureTextEntry={true}
						label="Message"
						mode="outlined"
						value={firstMessage}
						multiline
						onChangeText={(text) => setFirstMessage(text)}
					/>
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
							onPress={handleSend}
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
							Send
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};
