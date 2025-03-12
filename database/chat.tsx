import { collection, addDoc, getDocs, getFirestore, doc, getDoc, setDoc, query, where, updateDoc, QuerySnapshot, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
const ChatsCollection = collection(db, "Chat");


async function getChatRooms(uid: string): Promise<Chatroom[]> {
    const q = query(ChatsCollection, where("participants", "array-contains", uid));
    const querySnapshot = await getDocs(q);
    const chatRoomsList = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Chatroom;
    });
    return chatRoomsList;
}

async function getChatMessages(chatId: string): Promise<Message[]> {
    const chatMessagesCollection = collection(db, "Chat", chatId, "Messages");
    const querySnapshot = await getDocs(chatMessagesCollection);
    const chatMessagesList = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Message;
    }
    );
    return chatMessagesList;
}

async function isFirstMessage(chatId: string): Promise<boolean> {
    const docRef = doc(ChatsCollection, chatId);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
}

function generateChatId(sender: string, receiver: string): string {
    if (sender > receiver) {
        return sender + "+" + receiver;
    } else {
        return receiver + "+" + sender;
    }
}
async function sendFirstMessage( sender: string, receiver: string, content: string): Promise<boolean> {
    try {
        const chatId = generateChatId(sender, receiver);
        const participants = sender > receiver? [sender, receiver] : [receiver, sender];
        const docRef = doc(ChatsCollection, chatId);
        await setDoc(docRef, {
            lastMessage: content,
            lastMessageTime: Date.now(),
            participants,
            readStatus: { [sender]: true, [receiver]: false },
            status: "active"
        });
        const messageCollection = collection(db, "Chat", chatId, "Message");
        await addDoc(messageCollection, { sender, content, timestamp: Date.now() });
        return true;
    }
    catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
}

async function sendMessage( sender: string, receiver: string, content: string): Promise<boolean> {
    try {
        const chatId = generateChatId(sender, receiver);
        const docRef = doc(ChatsCollection, chatId);
        await updateDoc(docRef, {
            lastMessage: content,
            lastMessageTime: Date.now(),
            readStatus: { [sender]: true, [receiver]: false }
        })
        const messageCollection = collection(db, "Chat", chatId, "Message");
        const message = await addDoc(messageCollection, { sender, content, timestamp: Date.now() });
        return true;
    } catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
}

async function updateReadStatus(chatId: string, uid: string): Promise<boolean> {
    try {
        const docRef = doc(ChatsCollection, chatId);
        await updateDoc(docRef, {
            [`readStatus.${uid}`]: true
        });
        return true;
    } catch (error) {
        console.error("Error updating read status:", error);
        return false;
    }
}

async function getChatStatus(chatId: string): Promise<string> {
    const docRef = doc(ChatsCollection, chatId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().status;
    } else {
        return "not found";
    }
}

async function updateChatStatus(blockingUid: string, blockedUid: string, status: string): Promise<boolean> {
    try {
        const chatId = generateChatId(blockingUid, blockedUid);
        const docRef = doc(ChatsCollection, chatId);
        await updateDoc(docRef, {
            status
        });
        return true;
    } catch (error) {
        console.error("Error updating chat status:", error);
        return false;
    }
}

async function reportUser(reportingUid: string, reportedUid: string, reason: string): Promise<boolean> {
    try {
        const message = await addDoc(collection(db, "Report"), { reportingUid, reportedUid, reason, timestamp: Date.now() });
        updateChatStatus(reportingUid, reportedUid, "blocked and reported");
        return true;
    } catch (error) {
        console.error("Error blocking user:", error);
        return false;
    }
}

async function deleteChatroomsByUserId(uid: string): Promise<boolean> {
    try {
        const chatRooms = await getChatRooms(uid);
        chatRooms.forEach(async (chatRoom) => {
            const docRef = doc(ChatsCollection, chatRoom.id);
            await deleteDoc(docRef);
        });
        return true;
    } catch (error) {
        console.error("Error deleting chatroom:", error);
        return false;
    }
}

export { getChatRooms, getChatMessages, isFirstMessage, sendFirstMessage, sendMessage, updateReadStatus, getChatStatus, updateChatStatus, reportUser, generateChatId, deleteChatroomsByUserId };