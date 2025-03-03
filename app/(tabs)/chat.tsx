import Chat from "@/components/chatComponent";
import { useUserContext } from "@/context/UserContext";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/database/firebase";
import { Button } from "react-native";

export default function ChatScreen() {
    const { user, setUser } = useUserContext();
    const [students, setStudents] = useState<User[]>([]);
    const [receiver, setReceiver] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        onSnapshot(collection(db, "Student"), (snapshot) => {
            const query = snapshot.docs.map((doc) => {
                const data = doc.data();
                console.log(data);
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
        <View>
            <Text>students</Text>
            {students.map((student, index) => {
                return <Button key={index} title={student.displayName} onPress={() => setReceiver(student.uid)}></Button>;
            })}
            {receiver ? <Chat receiver={receiver} /> : null}
        </View>
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
