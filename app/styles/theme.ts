import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
  configureFonts,
} from "react-native-paper";
import { TextStyle } from "react-native";

const fontConfig: Record<string, TextStyle> = {
  bodyMedium: {
    fontFamily: "SpaceMono",
    fontWeight: "normal",
    letterSpacing: 0.5,
    lineHeight: 20,
    fontSize: 14,
  },
  titleLarge: {
    fontFamily: "SpaceMono",
    fontWeight: "normal",
    letterSpacing: 0.5,
    lineHeight: 20,
    fontSize: 24,
  },
};

const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#07070A",
    secondary: "#B6C8A9",
    tertiary: "#795663",
    background: "#B6C8A9",
    surface: "#FFFFFF",
    onSurface: "#07070A",
    onBackground: "#FFFAFF",
    outline: "#D1D1D6",
    error: "#FF3B30",
  },
  roundness: 8,
  fonts: configureFonts({ config: fontConfig }),
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#0A84FF",
    secondary: "#FF9F0A",
    background: "#121212",
    surface: "#1E1E1E",
    onSurface: "#E5E5EA",
    onBackground: "#B0B0B0",
    outline: "#333333",
    error: "#FF453A",
  },
  roundness: 8,
  fonts: configureFonts({ config: fontConfig }),
};

export default { lightTheme, darkTheme };
