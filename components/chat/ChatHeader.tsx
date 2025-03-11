import { useUserContext } from "@/context/UserContext";
import { reportUser, updateChatStatus } from "@/database/chat";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { ReportModal } from "@/modal/ReportModal";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, IconButton, Menu, Text } from "react-native-paper";

const ChatHeader = ({ displayName, photoUrl, receiverAccountType, receiverUid }: { displayName: string, photoUrl: string, receiverAccountType: string, receiverUid: string }) => {
    const router = useRouter();
    const { user } = useUserContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [blockModalOpen, setBlockModalOpen] = useState(false);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: photoUrl }} style={styles.image} />
                <Text variant="titleMedium" style={styles.title}>{displayName}</Text>
            </View>
        <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            anchor={
                <IconButton icon="dots-vertical" size={24} onPress={()=>{ setMenuOpen(true) }}/>
            }
        >
            { receiverAccountType === "Business" && 
            <Menu.Item
                title="View Business Profile"
                onPress={() => {
                    router.navigate({pathname: "/explore/publicProfile", params: {uid: receiverUid}});
                    setMenuOpen(false);
                }
            }/>}
            <ConfirmActionModal open={blockModalOpen} onClose={() => setBlockModalOpen(false)} title="Are you sure you want to block this user?"
            onConfirmAction={() => {
                updateChatStatus(user?.uid || "", receiverUid, "Blocked");
                setMenuOpen(false);
                setBlockModalOpen(false);
            }}/>
            <Menu.Item 
                title="Block"
                onPress={() => {
                    setBlockModalOpen(true);
                    setMenuOpen(false);
                }}
            />
            <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Are you sure you want to report this user?" 
            onConfirmAction={(reason: string) => {
                reportUser(user?.uid || "", receiverUid, reason);
                setMenuOpen(false);
                setReportModalOpen(false);
            }}/>
            <Menu.Item 
                title="Report"
                onPress={() => {
                    setReportModalOpen(true);
                    setMenuOpen(false);
                }}
            />
        </Menu>
        </View>
    );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // paddingRight: 10,
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  
});