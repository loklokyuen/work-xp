import { useUserContext } from "../../../context/UserContext";
import { Redirect, router } from "expo-router";

//need to add guest option here

export default function Opportunities() {
    const { accountType } = useUserContext();

    if (accountType === "Business") {
        return <Redirect href="/(tabs)/opportunity/Opportunities" />;
    } else if (accountType === "Student") {
        return <Redirect href="/(tabs)/opportunity/ViewAcceptedApplications" />;
    }
}
