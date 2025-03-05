import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Button, TextInput } from "react-native";
import { getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../database/firebase";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { useUserContext } from "../context/UserContext";
import styles from "../app/styles";

type chatProps = {
    receiver: string;
};
type Message = {
    sender: string;
    content: string;
};

export default function Chat({ receiver }: chatProps) {
    const { user, setUser } = useUserContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatId, setChatId] = useState<string>("");
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        setChatId(user.uid > receiver ? user.uid + receiver : receiver + user.uid);
    }, [receiver]);

    async function sendMessage() {
        if (content) {
            try {
                const messageCollection = collection(db, "chats", chatId, "messages");
                const message = await addDoc(messageCollection, { sender: user.displayName, content: content, timestamp: Date.now() });
                console.log("Message sent with id", message.id);
            } catch (error) {
                console.error("Error sending message:", error);
            }
            setContent("");
        }
    }

    useEffect(() => {
        if (chatId) {
            onSnapshot(query(collection(db, "chats", chatId, "messages"), orderBy("timestamp")), (snapshot) => {
                const query = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return { sender: data.sender, content: data.content };
                });
                setMessages(query);
            });
        }
    }, [chatId]);

    return (
        <View>
            {messages.map((message, index) => {
                return (
                    <Text key={index}>
                        {message.sender}: {message.content}
                    </Text>
                );
            })}
            {user.uid ? (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your message"
                        value={content}
                        onChangeText={setContent}
                        autoCapitalize="words"
                    />

                    <Button
                        title="Send Message"
                        onPress={() => {
                            sendMessage();
                        }}
                    />
                </View>
            ) : null}
        </View>
    );
}
