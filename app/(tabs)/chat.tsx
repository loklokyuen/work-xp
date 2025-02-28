import Chat from "@/components/chatComponent";
import { useUserContext } from "@/components/UserContext";
import { StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
    const { user, setUser } = useUserContext();

    return (
        <View>
            <Text>{user.displayName}</Text>
            <Chat sender={"1"} receiver={"2"} />;
        </View>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
