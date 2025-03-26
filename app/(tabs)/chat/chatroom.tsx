import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import React, {
	useState,
	useEffect,
	Fragment,
	useRef,
	useContext,
} from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	Keyboard,
	Image,
} from "react-native";
import { Text, TextInput, IconButton, useTheme } from "react-native-paper";
import { db } from "@/database/firebase";
import {
	collection,
	addDoc,
	query,
	orderBy,
	onSnapshot,
	Timestamp,
	doc,
	getDoc,
} from "firebase/firestore";
import { useUserContext } from "@/context/UserContext";
import { getChatStatus, sendMessage, updateReadStatus } from "@/database/chat";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatHeader from "@/components/chat/ChatHeader";
import { getUserById } from "@/database/user";
import { useFocusEffect } from "@react-navigation/native";
import { SnackbarContext } from "@/context/SnackbarProvider";

const ChatRoom = () => {
	const { showSnackbar } = useContext(SnackbarContext);
	const { user } = useUserContext();
	const { chatRoomId, receiverUid, receiverAccountType } =
		useLocalSearchParams<{
			chatRoomId: string;
			receiverUid: string;
			receiverAccountType: string;
		}>();
	const { colors } = useTheme();
	const navigation = useNavigation();
	const router = useRouter();

	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [status, setStatus] = useState<ChatStatus>();
	const [receiverData, setReceiverData] = useState<{
		displayName: string;
		photoUrl: string;
		uid: string;
	} | null>(null);
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		const fetchReceiverData = async () => {
			if (!receiverUid || !receiverAccountType || !user) return;

			try {
				const userData = await getUserById(receiverUid, receiverAccountType);
				if (userData) {
					setReceiverData({
						displayName: userData.displayName || "User",
						photoUrl: userData.photoUrl || "",
						uid: receiverUid,
					});
				}
			} catch (error) {
				showSnackbar(
					"Unable to get user data. Please try again later",
					"error",
					5000
				);
			}
		};

		fetchReceiverData();
	}, [chatRoomId, receiverAccountType, receiverUid]);

	useEffect(() => {
		if (!receiverData) {
			navigation.setOptions({
				headerBackTitle: "",
				headerTitle: () => (
					<ChatHeader
						displayName={"User"}
						photoUrl={""}
						receiverAccountType={""}
						receiverUid={""}
						status={status || "active"}
					/>
				),
				headerLeft: () => (
					<IconButton
						icon="arrow-left"
						onPress={() =>
							navigation.reset({
								index: 0,
								routes: [{ name: "chat" }],
							})
						}
					/>
				),
			});
		} else {
			navigation.setOptions({
				headerBackTitle: "",
				headerTitle: () => (
					<ChatHeader
						status={status || "active"}
						displayName={receiverData.displayName}
						photoUrl={receiverData.photoUrl}
						receiverAccountType={receiverAccountType || ""}
						receiverUid={receiverData.uid}
					/>
				),
				headerLeft: () => (
					<IconButton
						icon="arrow-left"
						onPress={() =>
							navigation.reset({
								index: 0,
								routes: [{ name: "chat" }],
							})
						}
					/>
				),
			});
		}
	}, [receiverData, navigation, receiverAccountType]);

	useFocusEffect(
		React.useCallback(() => {
			const fetchReceiverData = async () => {
				if (!receiverUid || !receiverAccountType || !user) return;

				try {
					const userData = await getUserById(receiverUid, receiverAccountType);
					if (userData) {
						setReceiverData({
							displayName: userData.displayName || "User",
							photoUrl: userData.photoUrl || "",
							uid: receiverUid,
						});
					}
				} catch (error) {
					showSnackbar(
						"Unable to get user data. Please try again later.",
						"error",
						5000
					);
				}
			};

			fetchReceiverData();
		}, [receiverUid, receiverAccountType])
	);

	useEffect(() => {
		let unsub = null;

		if (chatRoomId) {
			unsub = getAllMessages();
		}

		return () => {
			if (typeof unsub === "function") {
				unsub();
			}
		};
	}, [chatRoomId]);

	useEffect(() => {
		if (messages.length > 0) {
			scrollViewRef.current?.scrollToEnd({ animated: false });
		}
		if (user) updateReadStatus(chatRoomId, user.uid);
	}, [messages]);

	useEffect(() => {
		if (!chatRoomId) return;
		getChatStatus(chatRoomId).then((status) => {
			setStatus(status);
		});
	}, [chatRoomId]);

	const getAllMessages = () => {
		if (!chatRoomId) return null;

		const q = query(
			collection(db, "Chat", chatRoomId, "Message"),
			orderBy("timestamp", "asc")
		);

		return onSnapshot(
			q,
			(snapshot) => {
				const fetchedMessages = snapshot.docs.map((doc) => ({
					id: doc.id,
					sender: doc.data().sender,
					content: doc.data().content,
					timestamp: doc.data().timestamp,
				}));
				setMessages(fetchedMessages);
			},
			(error) => {
				showSnackbar(
					"Unable to fetch chats data. Please try again later.",
					"error",
					5000
				);
			}
		);
	};

	const handleSend = () => {
		if (inputMessage.trim() === "") return;
		onSendMsg(inputMessage);
		setInputMessage("");
	};

	const onSendMsg = async (msg: string) => {
		if (!user) return;
		sendMessage(user.uid, receiverUid, msg);
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={styles.messagesContainer}
					keyboardShouldPersistTaps="handled"
					onContentSizeChange={() =>
						scrollViewRef.current?.scrollToEnd({ animated: false })
					}>
					{messages.map((message) => (
						<MessageBubble key={message.id} message={message} />
					))}
					{messages.length === 0 && (
						<Text>No messages yet. Start the conversation!</Text>
					)}
				</ScrollView>

				{status === "active" && (
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							value={inputMessage}
							onChangeText={setInputMessage}
							placeholder="Type a message..."
							mode="outlined"
							multiline={Platform.OS === "ios"}
							right={
								<TextInput.Icon
									icon="send"
									onPress={handleSend}
									color={inputMessage.trim() ? colors.primary : "#A0A0A0"}
								/>
							}
							onSubmitEditing={handleSend}
						/>
					</View>
				)}
				{(status === "blocked" || status === "blocked and reported") && (
					<View
						style={[
							styles.inputContainer,
							{ padding: 20, height: 60, width: "100%" },
						]}>
						<Text style={{ textAlign: "center" }}>
							You cannot send message to this user.
						</Text>
					</View>
				)}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	messagesContainer: {
		flexGrow: 1,
		padding: 10,
		paddingBottom: 20,
	},
	inputContainer: {
		padding: 10,
		borderTopWidth: 1,
		borderTopColor: "#E5E5EA",
		width: "100%",
	},
	input: {
		backgroundColor: "white",
		maxHeight: 100,
	},
	emptyState: {
		textAlign: "center",
		marginTop: 40,
	},
});

export default ChatRoom;
