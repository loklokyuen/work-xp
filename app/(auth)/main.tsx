import { useUserContext } from "@/context/UserContext";

import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useState } from "react";

import { auth } from "@/database/firebase";
import { signInAnonymously } from "firebase/auth";
import { router } from "expo-router";

import styles from "../styles";

export default function AccountScreen() {
  const { user, setUser, accountType, setAccountType } = useUserContext();
  const [error, setError] = useState<string>("");
  const { colors, fonts } = useTheme();

  const handleGuestSignIn = () => {
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser({
          uid: user.uid,
          displayName: "Guest",
          email: "",
          photoUrl: "",
        });
        setAccountType("Guest");
        setError("");
        router.replace("/(tabs)");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  return (
    <View
      style={{
        backgroundColor: "#FFFAFF",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={[styles.title, { color: colors.primary, ...fonts.titleLarge }]}
      >
        Welcome to Work-XP!
      </Text>
      <Text
        style={[styles.body, { color: colors.tertiary, ...fonts.bodyMedium }]}
      >
        Find the work experience opportunity that's perfect for you, from the
        comfort of your phone! 📲
      </Text>
      <Text
        style={[
          styles.subTitle,
          { color: colors.quarternary, ...fonts.titleMedium },
        ]}
      >
        New to the app?
      </Text>
      <Button
        // mode="contained-tonal"
        // style={{ margin: 10 }}
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
        onPress={() => {
          router.replace("/CreateAccount");
        }}
      >
        Create an account
      </Button>
      <Text
        style={[
          styles.subTitle,
          { color: colors.quarternary, ...fonts.titleMedium },
        ]}
      >
        Already have an account?
      </Text>
      <Button
        // mode="contained-tonal"
        // style={{ margin: 10 }}
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
        onPress={() => {
          router.replace("/SignIn");
        }}
      >
        Sign in
      </Button>
      <Text
        style={[
          styles.subTitle,
          { color: colors.quarternary, ...fonts.titleMedium },
        ]}
      >
        Or just want to browse?
      </Text>
      <Button
        mode="outlined"
        // style={{ margin: 10 }}
        style={{
          backgroundColor: colors.primaryContainer,
          paddingVertical: 2, // Adds vertical padding for height
          borderRadius: 8, // Makes the box rounded (adjust as needed)
          justifyContent: "center", // Centers the text vertically
          alignItems: "center", // Centers the text horizontally
          borderWidth: 0,
        }}
        onPress={handleGuestSignIn}
      >
        <Text
          style={[
            styles.option,
            {
              fontFamily: "Lato", // Apply custom font
              fontSize: 15, // Adjust font size as needed
              color: colors.primary, // Set text color to primary or other color
              textAlign: "center", // Centers the text horizontally
            },
          ]}
        >
          Sign in as guest
        </Text>
      </Button>
      {error ? (
        <Text variant="titleSmall" style={{ color: "red" }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
