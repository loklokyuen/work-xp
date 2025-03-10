import { useUserContext } from "@/context/UserContext";
import { Stack, Redirect } from "expo-router";

const OpportunityLayout = () => {
    const { accountType } = useUserContext();

    // if (accountType === "Business") {
    //     return <Redirect href="/(tabs)/opportunity/(Business)/Opportunities" />;
    // } else if (accountType === "Student") {
    //     return <Redirect href="/(tabs)/opportunity/ViewAcceptedApplications" />;
    // }

    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="Opportunities" />
            <Stack.Screen name="listing" />
            <Stack.Screen name="applications" />
        </Stack>
    );
};

export default OpportunityLayout;
