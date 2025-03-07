import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Text, useColorScheme } from "react-native";

import Header from "@/components/Header";
import { UserProvider } from "@/context/UserContext";

import { PaperProvider, adaptNavigationTheme } from "react-native-paper";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native";

import merge from "deepmerge";
import theme from "./styles/theme";

const { lightTheme, darkTheme } = theme;

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, lightTheme);
const CombinedDarkTheme = merge(DarkTheme, darkTheme);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const theme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <PaperProvider theme={lightTheme}>
            <UserProvider>
                <ThemeProvider value={lightTheme}>
                    <Header />
                    {/* <Text style={{ fontFamily: "SpaceMono", fontSize: 20 }}>Test Font</Text> */}
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                </ThemeProvider>
            </UserProvider>
        </PaperProvider>
    );
}
