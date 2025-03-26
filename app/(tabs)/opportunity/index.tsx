import GuestModePrompt from "@/components/account/GuestModePrompt";
import { useUserContext } from "../../../context/UserContext";
import { Redirect } from "expo-router";

export default function index() {
	const { accountType } = useUserContext();

	if (accountType === "Business") {
		return <Redirect href="/(tabs)/opportunity/(Business)" />;
	} else if (accountType === "Student") {
		return <Redirect href="/(tabs)/opportunity/ViewAcceptedApplications" />;
	} else if (accountType === "Guest") {
		return <GuestModePrompt />;
	}
}
