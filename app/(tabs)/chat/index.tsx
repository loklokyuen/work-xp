import { useUserContext } from "@/context/UserContext";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Button, Card, ActivityIndicator, Icon, IconButton, useTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/database/firebase";
import ChatPreview from "@/components/chat/ChatPreview";
import styles from "@/app/styles";
import { useNavigation, useRouter } from "expo-router";

export default function ChatScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const { user, accountType } = useUserContext();
    const [chatRooms, setChatRooms] = useState<Chatroom[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { colors, fonts } = useTheme();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Chat",
            headerLeft: ()=> null,
        });
    }, [navigation]);

    useEffect(() => {
        if (!user) return;
        const collectionRef = collection(db, "Chat");
        const q = query(collectionRef, where("participants", "array-contains", user.uid));

        const unsub = onSnapshot(
            q,
            (snapshot) => {
                const chatRoomsData = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        participants: data.participants,
                        lastMessage: data.lastMessage,
                        lastMessageTime: data.lastMessageTime,
                        readStatus: data.readStatus,
                        status: data.status,
                    };
                });
                setLoading(false);
                chatRoomsData.sort((a, b) => {
                    if (a.lastMessageTime < b.lastMessageTime) return 1;
                    if (a.lastMessageTime > b.lastMessageTime) return -1;
                    return 0;
                });
                setChatRooms(chatRoomsData);
            },
            (error) => {
                setLoading(false);
                console.error("Error fetching chat rooms:", error);
            }
        );

        return () => unsub();
    }, [user]);
    function navigateToChat(chatRoomId: string, receiverAccountType: string) {
        router.push({
            pathname: "/chat/chatroom",
            params: { chatRoomId, receiverAccountType, receiverUid: chatRoomId.split("+").filter((uid) => uid !== user?.uid)[0] },
        });
    }

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
    return (
        <ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="titleMedium" style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                    Chatrooms
                </Text>
                <IconButton
                    icon="pen"
                    style={{ marginRight: 10 }}
                    size={20}
                    onPress={() => {
                        router.push({ pathname: "/chat/newChat" });
                    }}
                ></IconButton>
            </View>
            {chatRooms.length === 0 && (
                <Text variant="bodyMedium" style={{ padding: 20, textAlign: "center" }}>
                    No chats yet
                </Text>
            )}
            {chatRooms.map((chatroom) => {
                return <ChatPreview key={chatroom.id} chatRoom={chatroom} onChatRoomPressed={navigateToChat}></ChatPreview>;
            })}
            <View style={[styles.buttonContainer, { padding: 10 }]}>
                <Button
                    mode="contained"
                    style={{
                        backgroundColor: colors.secondary,
                        borderRadius: 8,
                        paddingLeft: 5,
                        paddingRight: 5,
                        marginBottom: 15,
                    }}
                    labelStyle={{
                        fontFamily: "Lato",
                        fontSize: 16,
                        fontWeight: "normal",
                        color: colors.onSecondary,
                    }}
                    onPress={() => {
                        router.push({ pathname: "/chat/newChat" });
                    }}
                >
                    Start a New Chat
                </Button>
            </View>
        </ScrollView>
    );
}
