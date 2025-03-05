import { collection, addDoc, getDocs, getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

async function getUserById(uid: string, accountType: string): Promise<User> {
    const docRef = doc(db, accountType, uid);
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();
    return user as User;
}

async function updateUserProfileImage(uid: string, accountType: string, photoUrl: string): Promise<void> {
    const docRef = doc(db, accountType, uid);
    await updateDoc(docRef, { photoUrl });
}

export { getUserById, updateUserProfileImage };