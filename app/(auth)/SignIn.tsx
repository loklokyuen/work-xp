import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/database/firebase";
import styles from "../styles";
import { useUserContext } from "@/context/UserContext";
import e from "express";
import { router } from "expo-router";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/database/firebase";

const SignIn = () => {
  const { setUser, setAccountType } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { colors, fonts } = useTheme();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser({
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoUrl: user.photoURL || "",
      });
      const document = await getDoc(doc(db, "Users", user.uid));
      const data = document.data();
      setAccountType(data?.accountType);
      setError("");
      router.replace("/(tabs)");
      // if (!user.emailVerified) {
      //     sendEmailVerification(user)
      //     alert('Please verify your email before signing in.');
      // } else {
      //     alert('Signed in successfully!');
      // }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      if (errorCode === "auth/invalid-credential") {
        setError("Incorrect password. Please check.");
      }
    }
  };

  const handleForgetPassword = () => {
    if (email === "") {
      setError("Please enter your email address.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text
        style={[styles.title, { color: colors.primary, ...fonts.titleLarge }]}
      >
        Sign in 👇
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.primaryContainer,
            color: colors.primary,
            ...fonts.bodyMedium,
          },
        ]}
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.primaryContainer,
            color: colors.primary,
            ...fonts.bodyMedium,
          },
        ]}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          onPress={handleSignIn}
          style={{
            backgroundColor: colors.secondary, // Background color
            borderRadius: 8, // Optional: For rounded edges
          }}
          labelStyle={{
            fontFamily: "Lato", // Apply custom font
            fontSize: 16, // Adjust font size as needed
            fontWeight: "normal", // Set font weight
            color: colors.tertiary, // Text color (onPrimary works well for contrast)
          }}
        >
          Sign In
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleForgetPassword}
          style={{
            backgroundColor: colors.primaryContainer,
            paddingVertical: 2, // Adds vertical padding for height
            paddingHorizontal: 16, // Adds horizontal padding for width
            borderRadius: 8, // Makes the box rounded (adjust as needed)
            justifyContent: "center", // Centers the text vertically
            alignItems: "center", // Centers the text horizontally
            marginVertical: 20, // Optional: Adds vertical spacing between elements
          }}
        >
          <Text
            style={[
              styles.option,
              {
                fontFamily: "Lato", // Apply custom font
                fontSize: 16, // Adjust font size as needed
                color: colors.primary, // Set text color to primary or other color
                textAlign: "center", // Centers the text horizontally
              },
            ]}
          >
            Forgot password 🤦
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[
          {
            textAlign: "center",
            margin: 20,
            fontFamily: "Lato", // Apply custom font
            fontSize: 16, // Adjust font size as needed
            color: colors.quarternary, // Set text color to primary or other color
          },
        ]}
      >
        Don't have an account?
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            router.replace("/CreateAccount");
          }}
          labelStyle={{
            fontFamily: "Lato", // Apply custom font
            fontSize: 16, // Adjust font size as needed
            fontWeight: "normal", // Font weight (use 'bold' or 'normal' as needed)
            color: colors.tertiary, // Set the text color to primary or other color
          }}
          style={{
            borderRadius: 8, // Optional: rounded corners for the button
            backgroundColor: colors.secondary, // Set border color to match the primary color
            paddingVertical: 4, // Adds vertical padding for height
          }}
        >
          Create Account
        </Button>
      </View>
    </View>
  );
};

export default SignIn;
