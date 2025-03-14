import { SnackbarContext } from "@/context/SnackbarProvider";
import { useUserContext } from "@/context/UserContext";
import { generateChatId, isFirstMessage, sendFirstMessage } from "@/database/chat";
import { ChatFirstMessageModal } from "@/modal/ChatFirstMessageModal";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function ChatButton({
    receiverUid,
    receiverDisplayName,
    receiverAccountType,
}: {
    receiverUid: string;
    receiverDisplayName: string;
    receiverAccountType: string;
}) {
    const { user } = useUserContext();
    const { showSnackbar } = useContext(SnackbarContext);
    
    const [chatModalOpen, setChatModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const colors = useTheme().colors;
    return (
        <View>
            <Button
                style={{
                    margin: 10,
                    backgroundColor: colors.secondary,
                    borderRadius: 8,
                    paddingLeft: 8,
                    paddingRight: 8,
                }}
                labelStyle={{
                    fontFamily: "Lato",
                    fontSize: 16,
                    fontWeight: "normal",
                    color: colors.onSecondary,
                }}
                onPress={async () => {
                    if (!user) {
                        return;
                    }
                    const chatId = generateChatId(user.uid, receiverUid);
                    if (await isFirstMessage(chatId)) {
                        setChatModalOpen(true);
                    } else {
                        router.navigate({
                            pathname: "/chat/chatroom",
                            params: {
                                chatRoomId: chatId,
                                receiverUid: receiverUid,
                                receiverAccountType: receiverAccountType,
                            },
                        });
                    }
                }}
            >
                Chat 💬
            </Button>
            <ChatFirstMessageModal
                open={chatModalOpen}
                reciever={receiverDisplayName}
                onClose={() => {
                    setChatModalOpen(false);
                }}
                onConfirmAction={async (content: string) => {
                    if (!user) {
                        return;
                    }
                    const isMessageSent = await sendFirstMessage(user.uid, receiverUid, content);
                    if (isMessageSent) {
                        const chatId = generateChatId(user.uid, receiverUid);
                        router.navigate({
                            pathname: "/chat/chatroom",
                            params: {
                                chatRoomId: chatId,
                                receiverUid: receiverUid,
                                receiverAccountType: receiverAccountType,
                            },
                        });
                    } else {
                        showSnackbar("Error sending message", "error", 5000);
                        // alert("Error sending message");
                    }
                }}
            />
        </View>
    );
}
