import Chat from "@/components/chat/chatComponent";
import { useUserContext } from "@/context/UserContext";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Button, Card, ActivityIndicator } from "react-native-paper";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "@/database/firebase";
import ChatPreview from "@/components/chat/ChatPreview";
import styles from "@/app/styles";
import { useRouter } from "expo-router";

export default function ChatScreen() {
    const router = useRouter();
    const { user, accountType } = useUserContext();
    const [chatRooms, setChatRooms] = useState<Chatroom[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!user) return;
        const collectionRef = collection(db, "Chat");
        const q = query(collectionRef, where("participants", "array-contains", user.uid));

        const unsub = onSnapshot(q, (snapshot) => {
            const charRoomsData = snapshot.docs.map((doc) => {
                setLoading(false);
                const data = doc.data();
                return { 
                    id: doc.id, 
                    participants: data.participants,
                    lastMessage: data.lastMessage,
                    lastMessageTime: data.lastMessageTime,
                    readStatus: data.readStatus,
                    status: data.status
                };
            });
            setChatRooms(charRoomsData);
        }, (error) => {
            setLoading(false);
            console.error('Error fetching chat rooms:', error);
        });

        return () => unsub();
    }, [user]);
    function navigateToChat(chatRoomId: string, receiverAccountType: string) {
        router.push({pathname: "/(chat)/chatroom", params: {chatRoomId, receiverAccountType}});
    }

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
    return (
        <ScrollView>
            <Text variant="titleMedium" style={{ paddingVertical: 10, paddingHorizontal: 20}}>Chat</Text>
            {chatRooms.map((chatroom, index) => {
                return <ChatPreview key={chatroom.id} chatRoom={chatroom} onChatRoomPressed={navigateToChat}></ChatPreview>;
            })}
            <View style={[styles.buttonContainer, {padding: 10}]}>
            <Button mode="contained" onPress={() => console.log("pressed")}>Start a New Chat</Button>
            <Button mode="outlined" onPress={() => console.log("pressed")}>Refresh</Button>
            </View>
        </ScrollView>
    );
}

