import { Stack } from "expo-router";

const OpportunityLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Opportunities" }} />
            <Stack.Screen name="edit" />
            <Stack.Screen name="post" />
            <Stack.Screen name="applications" />
        </Stack>
    );
};

export default OpportunityLayout;
