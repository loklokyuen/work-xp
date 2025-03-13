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
            <Text variant="bodyMedium"
            style={isSentByCurrentUser ? styles.sentMessageText : styles.receivedMessageText}>
                {message.content}
            </Text>
            <Text style={isSentByCurrentUser ? styles.sentMessageTimestamp : styles.receivedMessageTimestamp}>
                {message.timestamp? new Date(message.timestamp).toLocaleTimeString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
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
    sentMessageTimestamp: {
        fontSize: 10,
        color: '#d1d5db',
        marginTop: 5,
        alignSelf: 'flex-end'
    },
    receivedMessageTimestamp: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 5,
        alignSelf: 'flex-end'
    }
});
