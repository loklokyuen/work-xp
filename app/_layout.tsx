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
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import merge from "deepmerge";
import theme from "./styles/theme";
import { SnackbarProvider } from "@/context/SnackbarProvider";

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
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
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
    <PaperProvider theme={CombinedLightTheme}>
      <UserProvider>
        <ThemeProvider value={CombinedLightTheme}>
          <SnackbarProvider>
          {/* <Text style={{ fontFamily: "Lato", fontSize: 20 }}>Test Font</Text> */}
          <Header />
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" hidden={true} />
          </SnackbarProvider>
        </ThemeProvider>
      </UserProvider>
    </PaperProvider>
  );
}
