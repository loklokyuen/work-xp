import { Stack } from "expo-router";

const OpportunityLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Opportunities" }} />
            <Stack.Screen name="listing" />
            <Stack.Screen name="applications" />
        </Stack>
    );
};

export default OpportunityLayout;
