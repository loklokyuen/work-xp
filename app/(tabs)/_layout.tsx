import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/expoComponents/HapticTab";
import TabBarBackground from "../../components/expoComponents/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUserContext } from "@/context/UserContext";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { accountType } = useUserContext();

    if (!accountType) {
        console.log("accounttype", accountType);
        return <Redirect href="/(auth)/main" />;
    } else {
        console.log("accounttype", accountType);
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: "absolute",
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="opportunity"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: () => <Feather name="briefcase" size={30} color="black" />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: () => <Feather name="book-open" size={30} color="black" />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: () => <Feather name="message-square" size={30} color="black" />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: () => <AntDesign name="user" size={30} color="black" />,
                }}
            />
        </Tabs>
    );
}
