import {
  Button,
  IconButton,
  Text,
  TextInput,
  Menu,
  useTheme,
} from "react-native-paper";
import ImageViewer from "../expoComponents/imageViewer";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { View, Platform } from "react-native";
import { db } from "@/database/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserContext } from "@/context/UserContext";
import { updateBusinesInfo } from "@/database/business";
import styles from "@/app/styles";
import { Dispatch, SetStateAction } from "react";

import { industries, counties } from "@/data/businessData";
import { DeleteAccountButton } from "../DeleteAccountButton";
import { SnackbarContext } from "@/context/SnackbarProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type BusinessInfoProps = {
  businessInfo: Business;
  onUpdateInfo: () => void;
  setChangesMade: (value: boolean) => void;
  setEditMode: Dispatch<SetStateAction<Boolean>>;
};

export function EditableBusinessInfo({
  businessInfo,
  onUpdateInfo,
  setChangesMade,
  setEditMode,
}: BusinessInfoProps) {
  const { showSnackbar } = useContext(SnackbarContext);
  const [displayName, setDisplayName] = useState<string>(
    businessInfo.displayName || ""
  );
  const [bio, setBio] = useState<string>(businessInfo.description || "");
  const [industry, setIndustry] = useState<string>(businessInfo.sector || "");
  const [phoneNum, setPhoneNum] = useState<string>(
    businessInfo.phoneNumber || ""
  );
  const [email, setEmail] = useState<string>(businessInfo.email);
  const [address, setAddress] = useState<string>(businessInfo.address || "");
  const [county, setCounty] = useState<string>(businessInfo.county || "");

  const [industryMenuVisible, setIndustryMenuVisible] = useState(false);
  const [countyMenuVisible, setCountyMenuVisible] = useState(false);

  const { user } = useUserContext();

  const { colors, fonts } = useTheme();

  const handleSave = async () => {
    try {
      if (!user) return;
      const isUpdateSuccess = await updateBusinesInfo(
        user.uid,
        displayName,
        email,
        county,
        bio,
        phoneNum,
        industry,
        address
      );
      if (isUpdateSuccess) {
        onUpdateInfo();
        setChangesMade(false);
        setEditMode(false);
        showSnackbar("Profile successfully updated", "success", 5000);
      } else {
        showSnackbar("Error updating profile", "error", 5000);
        // alert("Error updating profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TextInput
        style={{
          margin: 10,
          backgroundColor: colors.primaryContainer,
          fontFamily: "Lato",
        }}
        label="Name"
        mode="outlined"
        value={displayName}
        onChangeText={(text) => {
          setDisplayName(text);
          setChangesMade(true);
        }}
      />
      <TextInput
        style={{
          margin: 10,
          backgroundColor: colors.primaryContainer,
          fontFamily: "Lato",
        }}
        label="Company Bio"
        mode="outlined"
        value={bio}
        multiline
        onChangeText={(text) => {
          setBio(text);
          setChangesMade(true);
        }}
      />

      <View style={{ margin: 10 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Lato",
            marginBottom: 5,
            color: colors.tertiary,
          }}
        >
          Industry
        </Text>
        <Menu
          visible={industryMenuVisible}
          onDismiss={() => setIndustryMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              buttonColor={colors.primaryContainer}
              textColor={colors.quarternary}
              onPress={() => setIndustryMenuVisible(true)}
              style={{
                borderRadius: 8,
                flexDirection: "row",
              }}
            >
              {industry || "Select Industry"}{" "}
              <MaterialCommunityIcons
                name="chevron-down"
                size={15}
                style={{ margin: 4 }}
                color={colors.tertiary}
              />
            </Button>
          }
        >
          {industries.map((item, index) => (
            <Menu.Item
              key={`${item}-${index}`}
              title={item}
              onPress={() => {
                if (industry !== item) setChangesMade(true);
                setIndustry(item);
                setIndustryMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>

      <View style={{ margin: 10 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Lato",
            marginBottom: 5,
            color: colors.tertiary,
          }}
        >
          County
        </Text>
        <Menu
          visible={countyMenuVisible}
          onDismiss={() => setCountyMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              buttonColor={colors.primaryContainer}
              textColor={colors.quarternary}
              onPress={() => setCountyMenuVisible(true)}
              style={{ borderRadius: 8, flexDirection: "row" }}
            >
              {county || "Select County"}{" "}
              <MaterialCommunityIcons
                name="chevron-down"
                size={15}
                style={{ margin: 4 }}
                color={colors.tertiary}
              />
            </Button>
          }
        >
          {counties.map((item, index) => (
            <Menu.Item
              key={`${item}-${index}`}
              title={item}
              onPress={() => {
                if (county !== item) setChangesMade(true);
                setCounty(item);
                setCountyMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>

      <TextInput
        style={{
          margin: 10,
          backgroundColor: colors.primaryContainer,
          fontFamily: "Lato",
        }}
        label="Telephone"
        mode="outlined"
        value={phoneNum}
        onChangeText={(text) => {
          setPhoneNum(text);
          setChangesMade(true);
        }}
        keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
      />
      <TextInput
        style={{
          margin: 10,
          backgroundColor: colors.primaryContainer,
          fontFamily: "Lato",
        }}
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setChangesMade(true);
        }}
        keyboardType="email-address"
      />
      <TextInput
        style={{
          margin: 10,
          backgroundColor: colors.primaryContainer,
          fontFamily: "Lato",
        }}
        label="Address"
        mode="outlined"
        multiline
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          setChangesMade(true);
        }}
      />
      <View style={styles.buttonContainer}>
        <Button
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 8,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
            width: "50%",
          }}
          labelStyle={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.tertiary,
          }}
          mode="contained-tonal"
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </View>
      <DeleteAccountButton />
    </>
  );
}
