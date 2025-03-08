import { StyleSheet } from "react-native";
import CardActions from "react-native-paper/lib/typescript/components/Card/CardActions";
import CardContent from "react-native-paper/lib/typescript/components/Card/CardContent";
import CardTitle from "react-native-paper/lib/typescript/components/Card/CardTitle";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    // backgroundColor: "#fff",
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    margin: 16,
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

  // this is my styling for searchbar, and business cards

  searchContainer: {
    padding: 10,
  },
  card: {
    // backgroundColor: "#07070A",
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 10,
  },
  cardContent: {
    margin: 0,
    padding: 0,
  },
  cardTitle: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingRight: 0,
    paddingLeft: 0,
    textAlign: "center",
  },
  cardActions: {
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    padding: 20,
  },
  cardCover: {
    width: 320,
    height: 200,
    resizeMode: "cover",
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  scrollViewContent: {
    paddingBottom: 75,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 5,
  },
  data: {
    minHeight: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  headerContainer: {
    maxHeight: 80,
    backgroundColor: "#795663",
    justifyContent: "center",
    textAlign: "center",
    padding: 0,
  },
});

export default styles;
