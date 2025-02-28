import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Button } from "react-native";
import { getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";

type chatProps = {
    sender: string;
    receiver: string;
};
type Message = {
    sender: string;
    content: string;
};

export default function Chat({ sender, receiver }: chatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [count, setCount] = useState<number>(1);

    async function sendMessage(chatId: string, sender: string, content: string) {
        try {
            const messageCollection = collection(db, "chats", chatId, "messages");
            const message = await addDoc(messageCollection, { sender, content });
            console.log("Message sent with id", message.id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    async function getMessages(chatId: string) {
        try {
            const querySnapshot = await getDocs(collection(db, "chats", chatId, "messages"));
            const query: Message[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return { sender: data.sender, content: data.content };
            });
            console.log(query);
            setMessages(query);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        onSnapshot(collection(db, "chats", "1", "messages"), (snapshot) => {
            const query = snapshot.docs.map((doc) => {
                const data = doc.data();
                return { sender: data.sender, content: data.content };
            });
            setMessages(query);
        });
    }, []);

    return (
        <View>
            {messages.map((message, index) => {
                return (
                    <Text key={index}>
                        {message.sender}, {message.content}
                    </Text>
                );
            })}
            <Text>{count}</Text>
            <Text>click bdgesge</Text>
            <Button
                title="Send Message"
                onPress={() => {
                    sendMessage("1", "testsender", `${count}`);
                    setCount((count) => count + 1);
                }}
            />
            <Button
                title="Receive Messages"
                onPress={() => {
                    getMessages("1");
                }}
            />
        </View>
    );
}
