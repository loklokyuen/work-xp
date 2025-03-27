import { Modal, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import styles from "@/app/styles";
interface ConfirmActionModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	message: string;
}

export const ConfirmationModal = ({
	open,
	onClose,
	title,
	message,
}: ConfirmActionModalProps) => {
	const { colors } = useTheme();
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={open}
			onRequestClose={onClose}>
			<View style={styles.modalContainerView}>
				<View style={styles.modalView}>
					<Text variant="titleMedium" style={{ margin: 10, padding: 2 }}>
						{title}
					</Text>
					{message && (
						<Text
							variant="bodyMedium"
							style={{
								margin: 10,
								padding: 2,
								flexWrap: "wrap",
								width: "90%",
								maxWidth: 280,
							}}>
							{message}
						</Text>
					)}
					<View style={styles.buttonContainer}>
						<Button
							mode="outlined"
							onPress={onClose}
							labelStyle={{ color: colors.onPrimary }}
							style={[styles.button, { backgroundColor: colors.primary }]}>
							OK
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};
