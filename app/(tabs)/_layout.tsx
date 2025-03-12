import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/expoComponents/HapticTab";
import TabBarBackground from "../../components/expoComponents/ui/TabBarBackground";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUserContext } from "@/context/UserContext";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
    const { user, accountType } = useUserContext();
    const { colors } = useTheme();

    if (!accountType) {
        return <Redirect href="/(auth)/main" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    position: Platform.OS === "ios" ? "absolute" : "relative",
                },
            }}
        >
            <Tabs.Screen
                name="opportunity"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <Feather name="briefcase" size={30} color={focused ? colors.tabIconSelected : colors.tabIconDefault} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <Feather name="book-open" size={30} color={focused ? colors.tabIconSelected : colors.tabIconDefault} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <Feather name="message-square" size={30} color={focused ? colors.tabIconSelected : colors.tabIconDefault} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => <AntDesign name="user" size={30} color={focused ? colors.tabIconSelected : colors.tabIconDefault} />,
                }}
            />
        </Tabs>
    );
}
