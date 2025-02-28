import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: "#fff",
        marginHorizontal: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        margin: 12,
        paddingHorizontal: 8,
    },
    option: {
        color: "blue",
        margin: 12,
        textAlign: "center",
    },
    button: {
        margin: 12,
    },
    error: {
        color: "red",
        margin: 12,
        textAlign: "center",
    },
    fixToText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default styles;
