import { Stack } from "expo-router";

const ChatLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="chatroom" />
            <Stack.Screen name="newChat" />
        </Stack>
    );
};

export default ChatLayout;
