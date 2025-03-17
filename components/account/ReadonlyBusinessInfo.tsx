import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { StyleSheet, Platform, View } from "react-native";
import { router } from "expo-router";
import styles from "@/app/styles";

type BusinessProps = {
  businessInfo: Business;
}
export function ReadonlyBusinessInfo({ businessInfo }: BusinessProps) {
  const { colors, fonts } = useTheme();

  if (businessInfo)
    return (
      <>
        <Text variant="titleMedium" style={{ marginHorizontal: 10, textAlign: "left" }}>
          Company Bio:
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            variant="bodyMedium"
            style={{
              flex: 1,
              width: 1,
              margin: 12,
              borderWidth: 1,
              padding: 10,
              minHeight: 40,
            }}
          >
            {businessInfo.description}
          </Text>
        </View>
        <Text variant="titleMedium" style={{ marginHorizontal: 10, textAlign: "left" }}>
          Industry:
        </Text>
        <Text variant="bodyMedium" style={styles.data}>
          {businessInfo.sector}
        </Text>
        <Text variant="titleMedium" style={{ marginHorizontal: 10, textAlign: "left" }}>
          Telephone:
        </Text>
        <Text variant="bodyMedium" style={styles.data}>
          {businessInfo.phoneNumber}
        </Text>
        <Text variant="titleMedium" style={{ marginHorizontal: 10, textAlign: "left" }}>
          Email:
        </Text>
        <Text variant="bodyMedium" style={styles.data}>
          {businessInfo.email}
        </Text>
        <Text variant="titleMedium" style={{ marginHorizontal: 10, textAlign: "left" }}>
          Address:
        </Text>
        <Text variant="bodyMedium" style={styles.data}>
          {businessInfo.address}
        </Text>
        <Text variant="titleMedium" style={{ marginHorizontal: 10, textAlign: "left" }}>
          DBS Certificate:
        </Text>
        <Text variant="bodyMedium" style={styles.data}>
          {"Upload here"}
        </Text>
        <View style={styles.proButtonContainer}>
          <Button
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingLeft: 5,
              paddingRight: 5,
              marginBottom: 15,
              width: "60%",
              alignSelf: "center",
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
              width: "60%",
              alignSelf: "center",
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
          <Button
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingLeft: 5,
              paddingRight: 5,
              marginBottom: 15,
              width: "60%",
              alignSelf: "center",
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
                pathname: "/(tabs)/explore/publicProfile",
                params: { uid: businessInfo.uid }
              });
            }}
          >
            View Public Profile
          </Button>
        </View>
      </>
    );
}
