import Chat from "@/components/chatComponent";
import { useUserContext } from "@/context/UserContext";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/database/firebase";

export default function ChatScreen() {
    const { user, setUser } = useUserContext();
    const [students, setStudents] = useState<User[]>([]);
    const [receiver, setReceiver] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {

        onSnapshot(collection(db, "Student"), (snapshot) => {
            const query = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    uid: data.uid,
                    displayName: data.displayName,
                    email: data.email,
                    photoUrl: data.photoUrl,
                    accountType: data.accountType,
                };
            });
            setStudents(query);
        });
    }, []);

    return (
        <ScrollView>
            <Text>students</Text>
            {students.map((student, index) => {
                return <Button mode="outlined" key={index} onPress={() => setReceiver(student.uid)}
                    style={{ margin: 10, backgroundColor: "#f0f0f0" }}
                >{student.displayName}</Button>;
            })}
            {receiver ? <Chat receiver={receiver} /> : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
