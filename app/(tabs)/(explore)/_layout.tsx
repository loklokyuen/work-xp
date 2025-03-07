import { Stack } from "expo-router";

const OpportunityLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Explore" }} />
            <Stack.Screen name="publicProfile" />
        </Stack>
    );
};

export default OpportunityLayout;
