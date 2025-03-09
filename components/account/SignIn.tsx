import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/database/firebase";
import styles from "../../app/styles";
import { useUserContext } from "@/context/UserContext";
import e from "express";

const SignIn: React.FC<accountProps> = ({
  setIsNewUser,
  setIsExistingUser,
}) => {
  const { setUser } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { colors, fonts } = useTheme();

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser({
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email || "",
          photoUrl: user.photoURL || "",
        });
        setError("");
        // if (!user.emailVerified) {
        //     sendEmailVerification(user)
        //     alert('Please verify your email before signing in.');
        // } else {
        //     alert('Signed in successfully!');
        // }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        if (errorCode === "auth/invalid-credential") {
          setError("Incorrect password. Please check.");
        }
      });
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
        User Sign In
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.primaryContainer,
            color: colors.primary,
            ...fonts.bodyLarge,
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
            ...fonts.bodyLarge,
          },
        ]}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          onPress={handleSignIn}
          style={{
            backgroundColor: colors.secondary,
          }}
          labelStyle={{
            fontFamily: "SpaceMono",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.tertiary,
          }}
        >
          Sign In
        </Button>
      </View>
      <TouchableOpacity
        onPress={handleForgetPassword}
        style={{
          backgroundColor: colors.primaryContainer,
          paddingVertical: 8, // Adds vertical padding for height
          paddingHorizontal: 16, // Adds horizontal padding for width
          borderRadius: 20, // Makes the box rounded (adjust as needed)
          justifyContent: "center", // Centers the text vertically
          alignItems: "center", // Centers the text horizontally
          marginVertical: 10, // Optional: Adds vertical spacing between elements
        }}
      >
        <Text
          style={[
            styles.option,
            {
              fontFamily: "SpaceMono",
              fontSize: 16,
              color: colors.primary,
              textAlign: "center",
            },
          ]}
        >
          Forgot password
        </Text>
      </TouchableOpacity>
      <Text
        style={[
          {
            textAlign: "center",
            margin: 10,
            fontFamily: "SpaceMono",
            fontSize: 20,
            color: colors.primary,
          },
        ]}
      >
        Don't have an account?
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setIsNewUser(true);
            setIsExistingUser(false);
          }}
          labelStyle={{
            fontFamily: "SpaceMono",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.tertiary,
          }}
          style={{
            backgroundColor: colors.secondary,
          }}
        >
          Create Account
        </Button>
      </View>
    </View>
  );
};

export default SignIn;
