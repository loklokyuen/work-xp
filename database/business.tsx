import { collection, addDoc, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
const BusinessUsersCollection = collection(db, 'Business');

async function getBusinessById(uid: string): Promise<User> {
    const docRef = doc(db, 'Business', uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    const business = docSnap.data();
    // if (student.exists()){
    //     return student as User;
    // }
    return business as User;
}

export { getBusinessById };