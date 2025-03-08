import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/expoComponents/HapticTab";
import TabBarBackground from "../../components/expoComponents/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
    const colorScheme = useColorScheme();

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
                name="(Opportunity)"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: () => <Feather name="briefcase" size={30} color="black" />,
                }}
            />
            <Tabs.Screen
                name="(explore)"
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
                name="(account)"
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: () => <AntDesign name="user" size={30} color="black" />,
                }}
            />
        </Tabs>
    );
}
