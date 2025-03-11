import styles from '@/app/styles';
import { useUserContext } from '@/context/UserContext';
import { db } from '@/database/firebase';
import { getUserAccountType, getUserById } from '@/database/user';
import { collection, onSnapshot, orderBy, query, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';


interface ChatPreviewProps {
    chatRoom: Chatroom;
    onChatRoomPressed: (chatRoomId: string, receiverAccountType: string) => void;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ chatRoom, onChatRoomPressed }) => {
    const { user } = useUserContext();
    const receiver = chatRoom.participants.filter((participant) => participant !== user?.uid)[0];
    const [formattedTime, setFormattedTime] = useState<string>("");
    const [photoUrl, setPhotoUrl] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [receiverAccountType, setReceiverAccountType] = useState<string>("");
    const [readStatus, setReadStatus] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;
        if (chatRoom.lastMessageTime){
            const timeNow = new Date();
            const messageTime = new Date(chatRoom.lastMessageTime);
            const diffInDays = timeNow.getDate() - messageTime.getDate();
            if (diffInDays < 1){
                setFormattedTime(messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            } else {
                if (diffInDays < 7) {
                    setFormattedTime(messageTime.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }));
                } else if (messageTime.getFullYear() === timeNow.getFullYear()) {
                    setFormattedTime(messageTime.toLocaleDateString([], { month: '2-digit', day: '2-digit' }));
                } else {
                setFormattedTime(messageTime.toLocaleDateString());
                }
            }
        }

        getUserAccountType(receiver)
            .then((accountType) => {
                setReceiverAccountType(accountType);
                return getUserById(receiver, accountType)
            })
            .then((user) => {
                setDisplayName(user?.displayName || "User");
                setPhotoUrl(user?.photoUrl || "");
            });
    }, [chatRoom, user, receiver]);

    useEffect(() => {
        if (user && chatRoom.readStatus[user.uid] !== undefined) {
            setReadStatus(chatRoom.readStatus[user.uid]);
        }
    }, [chatRoom.readStatus, user]);

    return (
        <TouchableOpacity style={{ marginHorizontal: 10, marginVertical: 2, padding: 10, flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: 'grey' }} 
        onPress={() => {onChatRoomPressed(chatRoom.id, receiverAccountType)}} >
            {photoUrl !== ""? <Image source={{ uri: photoUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />:
             <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#EADDFF', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton icon="account" size={30} />
                </View>}
            <View style={{ flex: 1, marginLeft: 10, justifyContent: "space-around" }}>
                <Text style={{ paddingLeft: 0, paddingRight: 0, top: 0, justifyContent: "flex-start", fontSize: 14}}>{displayName}</Text>
                <Text style={{ textAlign: "left", fontWeight: 300, fontSize: 12}} >
                {chatRoom.lastMessage.length > 30 ? chatRoom.lastMessage.slice(0, 30) + "..." : chatRoom.lastMessage}
                </Text>
            </View>
            {!readStatus && <View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: '#6750A4', position: 'absolute', bottom: 15, right: 10 }} />}
            <Text variant="bodySmall" style={{ position: 'absolute', top: 10, right: 10, textAlign: "right", color: '#6b7280'}}>{formattedTime}</Text>
            <Divider style={{ margin: 10 }} />
        </TouchableOpacity>

    );
};

export default ChatPreview;