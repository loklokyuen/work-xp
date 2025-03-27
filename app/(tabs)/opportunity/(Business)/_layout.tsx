import { Stack } from "expo-router";
import { IconButton } from "react-native-paper";
import { router } from "expo-router";

const OpportunityLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" />
			<Stack.Screen
				name="Opportunities"
				options={{
					headerRight: () => (
						<IconButton
							icon="pen"
							style={{ marginRight: 10 }}
							size={20}
							onPress={() => {
								router.push({
									pathname: "/(tabs)/opportunity/(Business)/listing",
									params: { listingId: "" },
								});
							}}></IconButton>
					),
				}}
			/>
			<Stack.Screen name="listing" />
			<Stack.Screen name="applications" />
		</Stack>
	);
};

export default OpportunityLayout;
