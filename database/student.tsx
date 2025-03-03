import { collection, addDoc, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
const StudentUsersCollection = collection(db, 'Student');


export interface Student {
    id: string;
    name: string;
    country: string;
    imageURLs?: string[];
}

async function getStudentById(uid: string): Promise<User> {
    const docRef = doc(db, 'Student', uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    const student = docSnap.data();
    // if (student.exists()){
    //     return student as User;
    // }
    return student as User;
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

export { getStudents, addStudent, getStudentById };

