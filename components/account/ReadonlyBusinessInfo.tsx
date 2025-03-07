import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { StyleSheet, Platform, View } from "react-native";



export function ReadonlyBusinessInfo({businessInfo}: BusinessProps) {

  if (businessInfo)
  return (
    <>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Company Bio:</Text>
      <View   style={{flexGrow: 1, flexDirection: 'row'}}>
        <Text variant="bodyMedium" style={{ flex: 1, width: 1, margin: 12, borderWidth: 1, padding: 10}}>
          {businessInfo.description}
        </Text>
      </View>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Industry:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {businessInfo.sector}
      </Text>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Telephone:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {businessInfo.phoneNumber}
      </Text>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Email:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {businessInfo.email}
      </Text>
      <Text variant="titleMedium" style={{ marginHorizontal: 10}}>Address:</Text>
      <Text variant="titleSmall" style={styles.data}>
        {businessInfo.address}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          onPress={() => {
            console.log("pressed");
          }}
        >
          View ads
        </Button>
      </View>
    </>
  );
}



const styles = StyleSheet.create({
  data: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
