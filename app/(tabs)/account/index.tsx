import { useUserContext } from "@/context/UserContext";

import { Redirect } from "expo-router";
export default function index() {
    const { user, accountType } = useUserContext();

    if (accountType === "Business") {
        return <Redirect href="/(tabs)/account/businessProfile" />;
    } else if (accountType === "Student") {
        return <Redirect href="/(tabs)/account/studentProfile" />;
    } else if (accountType === "Guest") {
        return <Redirect href="/(tabs)/account/guestProfile" />;
    }
}
