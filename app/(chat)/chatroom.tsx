import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import React, { useState, useLayoutEffect, useEffect, Fragment, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, Image } from 'react-native';
import { Text, TextInput, IconButton, useTheme } from 'react-native-paper';
import { auth, db } from '@/database/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
import { useUserContext } from '@/context/UserContext';
import { getChatStatus, sendMessage, updateReadStatus } from '@/database/chat';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatHeader from '@/components/chat/ChatHeader';
import { getUserById } from '@/database/user';

const ChatRoom = () => {
    const { user } = useUserContext();
    const { chatRoomId, receiverAccountType } = useLocalSearchParams<{
        chatRoomId: string;
        receiverAccountType: string;
    }>();
    const { colors, fonts } = useTheme();
    const navigation = useNavigation();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    
    const currentUserUid = user?.uid;
    const receiverUid = chatRoomId?.split("+").filter((uid) => uid !== currentUserUid)[0];

    useEffect(() => {
        getUserById(receiverUid, receiverAccountType).then((user) => {
            navigation.setOptions({ 
                headerBackTitle: '',
                headerTitle: () => (
                    <ChatHeader 
                    displayName={user.displayName} 
                    photoUrl={user.photoUrl} 
                    receiverAccountType={receiverAccountType}
                    receiverUid={receiverUid}
                    />
                )
            });
        });
    
    }, [receiverUid, navigation]);

    useEffect(() => {
        let unsub = null;
        
        if (chatRoomId) {
            unsub = getAllMessages();
        }
        
        return () => {
            if (typeof unsub === 'function') {
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
        getChatStatus(chatRoomId).then((status) => {
            setStatus(status);
        })
    }, [status]);

    const getAllMessages = () => {
        if (!chatRoomId) return null;

        const q = query(
            collection(db, 'Chat', chatRoomId, 'Message'), 
            orderBy('timestamp', 'asc')
        );
        
        return onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                sender: doc.data().sender,
                content: doc.data().content,
                timestamp: doc.data().timestamp
            }));
            setMessages(fetchedMessages);
        }, (error) => {
            console.error("Error fetching messages:", error);
        });
    };

    const handleSend = () => {
        if (inputMessage.trim() === '') return;
        onSendMsg(inputMessage);
        setInputMessage('');
    };

    const onSendMsg = async (msg: string) => {
        if (!user) return;
        sendMessage(user.uid, receiverUid, msg);
    };
      
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.messagesContainer}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
                >
                    {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
                    {messages.length === 0 && (
                        <Text>No messages yet. Start the conversation!</Text>
                    )}
                </ScrollView>
                
                {status === "active" && <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="Type a message..."
                        mode="outlined"
                        multiline={Platform.OS === 'ios'}
                        right={
                            <TextInput.Icon
                                icon="send"
                                onPress={handleSend}
                                color={inputMessage.trim() ? colors.primary : '#A0A0A0'}
                            />
                        }
                        onSubmitEditing={handleSend}
                    />
                </View>}
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    messagesContainer: {
        flexGrow: 1,
        padding: 10,
        paddingBottom: 20,
    },
    inputContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        width: '100%',
    },
    input: {
        backgroundColor: 'white',
        maxHeight: 100,
    },
    emptyState: {
        textAlign: 'center',
        marginTop: 40,
    }
});

export default ChatRoom;




