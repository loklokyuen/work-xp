import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import styles from "@/app/styles";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
    const router = useRouter();
    const { colors } = useTheme();

    const handleTitlePress = () => {
        router.push("/(tabs)/explore");
    };

    return (
        <SafeAreaView>
            <Appbar.Header style={[styles.headerContainer, { backgroundColor: colors.secondary }]}>
                <TouchableOpacity onPress={handleTitlePress}>
                    <Appbar.Content
                        title="Work-XP"
                        titleStyle={{
                            fontSize: 18,
                            alignItems: "center",
                            padding: 0,
                            flex: 2,
                            color: colors.tertiary,
                        }}
                    />
                </TouchableOpacity>
            </Appbar.Header>
        </SafeAreaView>
    );
};

export default Header;
