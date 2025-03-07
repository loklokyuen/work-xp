import * as React from "react";
import { Appbar, Menu, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "@/app/styles";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useUserContext } from "../context/UserContext";

const Header = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const router = useRouter();
    const { user } = useUserContext();

    const handleMore = () => {
        setVisible((prevState) => !prevState);
    };

    const handleExploreBusinesses = () => {
        setVisible(false);
        router.push("./explore");
    };

    const handleTitlePress = () => {
        router.push("/");
    };

    const handleProfile = () => {
        router.push("./account");
    };

    return (
        <Appbar.Header style={styles.headerContainer}>
            <TouchableOpacity onPress={handleTitlePress}>
                <Appbar.Content title="Work-XP" />
            </TouchableOpacity>

            <Menu visible={visible} onDismiss={() => setVisible(false)} anchor={<Appbar.Action icon="dots-vertical" onPress={handleMore} />}>
                <Menu.Item onPress={handleExploreBusinesses} title="Explore Businesses" />
            </Menu>
            <Appbar.Action icon={() => <Avatar.Icon size={24} icon="account" />} onPress={handleProfile} />
        </Appbar.Header>
    );
};

export default Header;
