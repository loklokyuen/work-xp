import { Stack } from "expo-router";

const OpportunityLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="Opportunities" />
            <Stack.Screen name="listing" />
            <Stack.Screen name="applications" />
            <Stack.Screen name="ViewAcceptedApplications" />
        </Stack>
    );
};

export default OpportunityLayout;
