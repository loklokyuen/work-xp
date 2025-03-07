import { collection, addDoc, getDocs, getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

async function getUserById(uid: string, accountType: string): Promise<User> {
    const docRef = doc(db, accountType, uid);
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();
    return user as User;
}

async function addNewUser(uid: string, accountType: string, displayName: string, photoUrl: string, email: string): Promise<boolean> {
    try {
        await setDoc(doc(db, accountType, uid), {
            uid,
            displayName,
            photoUrl,
            email
        });
        return true
    } catch (error) {
        alert("Error adding new user: " + error);
        return false;
    }
}

async function updateUserProfileImage(uid: string, accountType: string, photoUrl: string): Promise<boolean> {
    try {
        const docRef = doc(db, accountType, uid);
        await updateDoc(docRef, { photoUrl }).then(() => {
        })
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { getUserById, updateUserProfileImage, addNewUser };