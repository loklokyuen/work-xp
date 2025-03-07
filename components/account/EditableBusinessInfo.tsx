import { Button, IconButton, Text, TextInput, Menu } from "react-native-paper";
import ImageViewer from "../expoComponents/imageViewer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { View, Platform } from "react-native";
import { db } from "@/database/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserContext } from "@/context/UserContext";
import { updateBusinesInfo } from "@/database/business";

type BusinessInfoProps = {
  businessInfo: Business;
  onUpdateInfo: () => void;
};

export function EditableBusinessInfo({
  businessInfo,
  onUpdateInfo,
}: BusinessInfoProps) {
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

  const industries = [
    "Agriculture",
    "Automotive",
    "Aerospace",
    "Banking",
    "Construction",
    "Consulting",
    "Education",
    "Energy",
    "Finance",
    "Healthcare",
    "Hospitality",
    "Human Resources",
    "Insurance",
    "Information Technology",
    "Legal",
    "Logistics",
    "Manufacturing",
    "Media",
    "Non-profit",
    "Pharmaceutical",
    "Public Sector",
    "Retail",
    "Real Estate",
    "Research & Development",
    "Telecommunications",
    "Transportation",
    "Utilities",
    "Wholesale",
    "Tourism",
    "Creative Arts",
    "Marketing",
    "Fashion",
    "Entertainment",
    "Engineering",
    "Sports",
  ];

  const counties = [
    "Bedfordshire",
    "Belfast",
    "Berkshire",
    "Bristol",
    "Buckinghamshire",
    "Cambridgeshire",
    "Cardiff",
    "Cheshire",
    "Clackmannanshire",
    "Cornwall",
    "Cumbria",
    "Denbighshire",
    "Derbyshire",
    "Derry",
    "Devon",
    "Dorset",
    "Dumfries and Galloway",
    "Durham",
    "East Ayrshire",
    "East Dunbartonshire",
    "East Lothian",
    "East Riding of Yorkshire",
    "East Sussex",
    "Essex",
    "Fermanagh",
    "Glamorgan",
    "Gloucestershire",
    "Greater London",
    "Greater Manchester",
    "Gwynedd",
    "Hampshire",
    "Herefordshire",
    "Hertfordshire",
    "Highland",
    "Isle of Wight",
    "Kent",
    "Lancashire",
    "Leicestershire",
    "Lincolnshire",
    "Merseyside",
    "Midlothian",
    "Monmouthshire",
    "Moray",
    "Neath Port Talbot",
    "North Ayrshire",
    "North East Lincolnshire",
    "North Lincolnshire",
    "North Somerset",
    "North Yorkshire",
    "Northamptonshire",
    "Northumberland",
    "Nottinghamshire",
    "Oxfordshire",
    "Pembrokeshire",
    "Perth and Kinross",
    "Powys",
    "Renfrewshire",
    "Rutland",
    "Shropshire",
    "South Ayrshire",
    "South Gloucestershire",
    "South Lanarkshire",
    "South Yorkshire",
    "Staffordshire",
    "Suffolk",
    "Surrey",
    "Tyne and Wear",
    "West Dunbartonshire",
    "West Lothian",
    "West Midlands",
    "West Sussex",
    "West Yorkshire",
    "Worcestershire",
    "Wrexham",
  ];

  const { user } = useUserContext();

  const handleSave = async () => {
    try {
      if (!user) return;
      const isUpdateSuccess = await updateBusinesInfo(
        user.uid,
        email,
        county,
        bio,
        phoneNum,
        industry,
        address
      );
      if (isUpdateSuccess) {
        alert("Changes have been saved");
        onUpdateInfo();
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TextInput
        style={{ margin: 10 }}
        label="Company Bio"
        mode="outlined"
        value={bio}
        multiline
        onChangeText={(text) => setBio(text)}
      />
      <View style={{ margin: 10 }}>
        <Menu
          visible={industryMenuVisible}
          onDismiss={() => setIndustryMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setIndustryMenuVisible(true)}
            >
              {industry || "Select Industry"}
            </Button>
          }
        >
          {industries.map((item, index) => (
            <Menu.Item
              key={`${item}-${index}`}
              title={item}
              onPress={() => {
                setIndustry(item);
                setIndustryMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>
      <View style={{ margin: 10 }}>
        <Menu
          visible={countyMenuVisible}
          onDismiss={() => setCountyMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setCountyMenuVisible(true)}>
              {county || "Select County"}
            </Button>
          }
        >
          {counties.map((item, index) => (
            <Menu.Item
              key={`${item}-${index}`}
              title={item}
              onPress={() => {
                setCounty(item);
                setCountyMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>
      <TextInput
        style={{ margin: 10 }}
        label="Telephone"
        mode="outlined"
        value={phoneNum}
        onChangeText={(text) => setPhoneNum(text)}
        keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
      />
      <TextInput
        style={{ margin: 10 }}
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={{ margin: 10 }}
        label="Address"
        mode="outlined"
        multiline
        value={address}
        onChangeText={(text) => setAddress(text)}
      />

      <Button
        style={{ margin: 10 }}
        mode="contained-tonal"
        onPress={handleSave}
      >
        Save Changes
      </Button>
    </>
  );
}
