import { collection, addDoc, getDocs, getFirestore } from "firebase/firestore";
import { db } from "./firebase";
const StudentUsersCollection = collection(db, 'Student_Users');

export interface Student {
    id: string;
    name: string;
    country: string;
    imageURLs?: string[];
}

async function getStudents(): Promise<Student[]> {
    const querySnapshot = await getDocs(StudentUsersCollection);
    const studentsList = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Student;
    });
    return studentsList;
}

async function addStudent(fullName: string, country: string, imageURLs: string[]): Promise<Student> {
    const docRef = await addDoc(StudentUsersCollection, {
        name: fullName,
        country: country,
        imageURLs: imageURLs
    });
    const studentAdded = { id: docRef.id, name: fullName, country: country };
    return studentAdded;
}

export { getStudents, addStudent };

