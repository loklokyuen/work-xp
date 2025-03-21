import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import styles from "@/app/styles";
import { router } from "expo-router";
import { auth } from "@/database/firebase";
import { useUserContext } from "@/context/UserContext";

export default function GuestModePrompt() {
  const { colors, fonts } = useTheme();
  const { setUser, setAccountType } = useUserContext();

  return (
    <View>
      <Text
        style={[styles.title, { color: colors.primary, ...fonts.titleLarge }]}
      >
        Welcome Guest!
      </Text>
      <Text
        style={[styles.body, { color: colors.tertiary, ...fonts.bodyMedium }]}
      >
        You are currently in guest mode. Please create an account or sign in to
        enjoy the full functionalities.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            backgroundColor: colors.secondary, // Background color
            borderRadius: 8, // Optional: For rounded edges
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "Lato", // Apply custom font
            fontSize: 16, // Adjust font size as needed
            fontWeight: "normal", // Set font weight
            color: colors.tertiary, // Text color (onPrimary works well for contrast)
          }}
          // mode="contained-tonal"
          onPress={async () => {
            await auth.signOut();
            setUser(null);
            setAccountType(null);
            router.replace("/(auth)/CreateAccount");
          }}
        >
          Create Account
        </Button>
        <Button
          style={{
            backgroundColor: colors.secondary, // Background color
            borderRadius: 8, // Optional: For rounded edges
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "Lato", // Apply custom font
            fontSize: 16, // Adjust font size as needed
            fontWeight: "normal", // Set font weight
            color: colors.tertiary, // Text color (onPrimary works well for contrast)
          }}
          // mode="contained-tonal"
          onPress={async () => {
            await auth.signOut();
            setUser(null);
            setAccountType(null);
            router.replace("/(auth)/SignIn");
          }}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
}
