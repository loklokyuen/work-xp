import { useUserContext } from "@/context/UserContext";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface MessageBubbleProps {
    message: Message;
}

 const MessageBubble = ({message}: MessageBubbleProps) => {
    const { user } = useUserContext();
    const isSentByCurrentUser = message.sender === user?.uid;
        
    return (
        <View
            key={message.id} 
            style={[
                styles.messageBubble, 
                isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage
            ]}
        >
            <Text style={isSentByCurrentUser ? styles.sentMessageText : styles.receivedMessageText}>
                {message.content}
            </Text>
            <Text style={styles.timestamp}>
                {message.timestamp? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
            </Text>
        </View>
    );
    };

export default MessageBubble;

const styles = StyleSheet.create({
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#6750A4',
        borderBottomRightRadius: 5,
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#EADDFF',
        borderBottomLeftRadius: 5,
    },
    sentMessageText: {
        color: 'white',
    },
    receivedMessageText: {
        color: 'black',
    },
    timestamp: {
        fontSize: 10,
        color: '#888',
        marginTop: 5,
        alignSelf: 'flex-end',
    }
});
