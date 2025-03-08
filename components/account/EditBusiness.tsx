import { Button, IconButton, Text, TextInput, Menu } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import { db } from "@/database/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserContext } from "@/context/UserContext";
import { updateBusinesInfo, getBusinessById } from "@/database/business";
import { industries, counties } from "@/data/businessData";

export function EditBusiness() {
    const [businessInfo, setBusinessInfo] = useState<Business>();
    const { user } = useUserContext();

    // const [displayName, setDisplayName] = useState<string>(businessInfo.displayName || "");
    // const [description, setDescription] = useState<string>(businessInfo.description || "");
    // const [industry, setIndustry] = useState<string>(businessInfo.sector || "");
    // const [phoneNum, setPhoneNum] = useState<string>(businessInfo.phoneNumber || "");
    // const [email, setEmail] = useState<string>(businessInfo.email);
    // const [address, setAddress] = useState<string>(businessInfo.address || "");
    // const [county, setCounty] = useState<string>(businessInfo.county || "");
    const [loading, setLoading] = useState<Boolean>(true);

    const [industryMenuVisible, setIndustryMenuVisible] = useState(false);
    const [countyMenuVisible, setCountyMenuVisible] = useState(false);

    useEffect(() => {
        if (!user) return;
        getBusinessById(user.uid)
            .then((res) => {
                if (res) {
                    setBusinessInfo({
                        uid: res.uid,
                        displayName: res.displayName || "",
                        sector: res.sector || "",
                        photoUrl: res.photoUrl || "",
                        email: res.email || "",
                        address: res.address || "",
                        county: res.county || "",
                        industry: res.industry || "",
                        description: res.description || "",
                        phoneNumber: res.phoneNumber || "",
                        opportunities: [],
                        reviews: [],
                        applications: [],
                    });
                    setLoading(false);
                    return true;
                } else return false;
            })
            .then((userFound) => {
                if (!userFound) {
                    setLoading(false);
                }
            });
    }, [user]);

    function onUpdateInfo() {
        if (!user) return;
        setLoading(true);

        getBusinessById(user.uid).then((res) => {
            setBusinessInfo({
                uid: res.uid,
                displayName: res.displayName || "",
                sector: res.sector || "",
                photoUrl: res.photoUrl || "",
                email: res.email || "",
                address: res.address || "",
                county: res.county || "",
                industry: res.industry || "",
                description: res.description || "",
                phoneNumber: res.phoneNumber || "",
                opportunities: [],
                reviews: [],
                applications: [],
            });
            setLoading(false);
        });
    }

    const handleSave = async () => {
        try {
            if (!user) return;
            const isUpdateSuccess = await updateBusinesInfo(
                user.uid,
                businessInfo?.displayName,
                businessInfo?.email,
                businessInfo?.county,
                businessInfo?.description,
                businessInfo?.phoneNumber,
                businessInfo?.industry,
                businessInfo?.address
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

    function setProperty(property: string, value: string) {
        setBusinessInfo((info) => {
            const copy = { ...info };
            copy[property] = value;
            return copy;
        });
    }

    return (
        <>
            <TextInput
                style={{ margin: 10 }}
                label="Name"
                mode="outlined"
                value={businessInfo?.displayName}
                onChangeText={(text) => setProperty("displayName", text)}
            />
            <TextInput
                style={{ margin: 10 }}
                label="Company Bio"
                mode="outlined"
                value={businessInfo?.description}
                multiline
                onChangeText={(text) => setProperty("description", text)}
            />
            <View style={{ margin: 10 }}>
                <Menu
                    visible={industryMenuVisible}
                    onDismiss={() => setIndustryMenuVisible(false)}
                    anchor={
                        <Button mode="outlined" onPress={() => setIndustryMenuVisible(true)}>
                            {businessInfo?.industry || "Select Industry"}
                        </Button>
                    }
                >
                    {industries.map((item, index) => (
                        <Menu.Item
                            key={`${item}-${index}`}
                            title={item}
                            onPress={() => {
                                setProperty("industry", item);
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
                            {businessInfo?.county || "Select County"}
                        </Button>
                    }
                >
                    {counties.map((item, index) => (
                        <Menu.Item
                            key={`${item}-${index}`}
                            title={item}
                            onPress={() => {
                                setProperty("county", item);
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
                value={businessInfo?.phoneNumber}
                onChangeText={(text) => setProperty("phoneNumber", text)}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            />
            <TextInput
                style={{ margin: 10 }}
                label="Email"
                mode="outlined"
                value={businessInfo?.email}
                onChangeText={(text) => setProperty("email", text)}
                keyboardType="email-address"
            />
            <TextInput
                style={{ margin: 10 }}
                label="Address"
                mode="outlined"
                multiline
                value={businessInfo?.address}
                onChangeText={(text) => setProperty("address", text)}
            />

            <Button style={{ margin: 10 }} mode="contained-tonal" onPress={handleSave}>
                Save Changes
            </Button>
        </>
    );
}
