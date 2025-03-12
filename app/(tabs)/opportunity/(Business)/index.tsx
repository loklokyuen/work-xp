import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import styles from "@/app/styles";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";

export default function Briefcase() {
  const { user } = useUserContext();
  const { colors, fonts } = useTheme();

  return (
    <>
      <Text
        style={[styles.title, { color: colors.primary, fontFamily: "Lato" }]}
      >
        Welcome to your Briefcase!
      </Text>
      <Text
        style={[styles.body, { color: colors.onSecondary, fontFamily: "Lato", paddingBottom: 15, }]}
      >
       As a business user, you can manage your work experience listings and your bookings below 👇
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.onPrimary,
          }}
          mode="contained-tonal"
          onPress={() => {
            router.push({
              pathname: "/(tabs)/opportunity/(Business)/Opportunities",
            });
          }}
        >
          Manage Listings
        </Button>
        <Button
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.onPrimary,
          }}
          mode="contained-tonal"
          onPress={() => {
            router.push({
              pathname: "/(tabs)/opportunity/(Business)/manageBooking",
            });
          }}
        >
          Manage Bookings
        </Button>
      </View>
    </>
  );
}
