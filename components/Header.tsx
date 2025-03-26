import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { TouchableOpacity, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserContext } from "@/context/UserContext";

const Header = () => {
	const { user } = useUserContext();
	const router = useRouter();
	const { colors } = useTheme();

	const handleTitlePress = () => {
		if (!user) {
			router.replace("/(auth)/main");
		} else {
			router.replace("/(tabs)/explore");
		}
	};

	const headerHeight = Platform.OS === "ios" ? 50 : 56;

	return (
		<SafeAreaView edges={["top"]} style={{ backgroundColor: colors.secondary }}>
			<View
				style={{
					height: headerHeight,
					backgroundColor: colors.secondary,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<TouchableOpacity
					onPress={handleTitlePress}
					style={{
						width: "100%",
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Appbar.Content
						title="Work-XP"
						titleStyle={{
							fontSize: 18,
							fontFamily: "Lato",
							color: colors.tertiary,
							textAlign: "center",
							paddingTop: 16,
						}}
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default Header;
