import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
  configureFonts,
} from "react-native-paper";
import { TextStyle } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

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
  titleMedium: {
    fontFamily: "SpaceMono",
    fontWeight: "normal",
    letterSpacing: 0.5,
    lineHeight: 20,
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6750A4",
    onPrimary: "#FFFFFF",
    primaryContainer: "#EADDFF",
    onPrimaryContainer: "#21005D",
    secondary: "#B6F399",
    onSecondary: "#07070A",
    secondaryContainer: "#E8DEF8",
    onSecondaryContainer: "#1D192B",
    tertiary: "#07070A",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FFD8E4",
    onTertiaryContainer: "#31111D",
    quarternary: "#1E80A4",
    background: "#FEF7FF",
    onBackground: "#1D1B20",
    surface: "#FEF7FF",
    onSurface: "#1D1B20",
    surfaceVariant: "#E7E0EC",
    onSurfaceVariant: "#49454F",
    outline: "#79747E",
    error: "#FF5470",
    onError: "#FFFFFF",
    errorContainer: "#F9DEDC",
    onErrorContainer: "#410E0B",
    text: "#11181C",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#07070A",
    tabIconSelected: tintColorLight,
  },
  roundness: 8,
  fonts: configureFonts({ config: fontConfig }),
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#D0BCFF",
    onPrimary: "#381E72",
    primaryContainer: "#4F378B",
    onPrimaryContainer: "#EADDFF",
    secondary: "#CCC2DC",
    onSecondary: "#332D41",
    secondaryContainer: "#4A4458",
    onSecondaryContainer: "#E8DEF8",
    tertiary: "#EFB8C8",
    onTertiary: "#492532",
    tertiaryContainer: "#633B48",
    onTertiaryContainer: "#FFD8E4",
    background: "#1C1B1F",
    onBackground: "#E6E1E5",
    surface: "#1C1B1F",
    onSurface: "#E6E1E5",
    surfaceVariant: "#49454F",
    onSurfaceVariant: "#CAC4D0",
    outline: "#938F99",
    error: "#F2B8B5",
    onError: "#601410",
    errorContainer: "#8C1D18",
    onErrorContainer: "#F9DEDC",
  },
  roundness: 8,
  fonts: configureFonts({ config: fontConfig }),
};

export default { lightTheme, darkTheme };
