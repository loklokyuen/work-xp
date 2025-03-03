import { collection, addDoc, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

async function getUserById(uid: string, accountType: string): Promise<User> {
    const docRef = doc(db, accountType, uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    const user = docSnap.data();
    return user as User;
}

export { getUserById };