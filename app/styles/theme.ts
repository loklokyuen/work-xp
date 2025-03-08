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
    // primary: "#07070A",
    // secondary: "#B6C8A9",
    // tertiary: "#795663",
    // background: "#B6C8A9",
    // surface: "#FFFFFF",
    // onSurface: "#07070A",
    // onBackground: "#FFFAFF",
    // outline: "#D1D1D6",
    // error: "#FF3B30",
    primary: "#974068",
    onPrimary: "#FFFFFF",
    primaryContainer: "#FFD9E5",
    onPrimaryContainer: "#3E0022",
    secondary: "#B6C8A9",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#B6F399",
    onSecondaryContainer: "#052100",
    tertiary: "#07070A",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#CCE5FF",
    onTertiaryContainer: "#001E31",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    background: "#FFFBFF",
    onBackground: "#201A1C",
    surface: "#FFFBFF",
    onSurface: "#201A1C",
    surfaceVariant: "#F2DEE3",
    onSurfaceVariant: "#514347",
    outline: "#837378",
    outlineVariant: "#D5C2C7",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#352F31",
    inverseOnSurface: "#FAEEF0",
    inversePrimary: "#FFB0CE",
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
