import { Stack } from "expo-router";

const OpportunityLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(Business)" options={{ headerShown: false }} />
            <Stack.Screen name="ViewAcceptedApplications" options={{ headerShown: false }} />
        </Stack>
    );
};

export default OpportunityLayout;
