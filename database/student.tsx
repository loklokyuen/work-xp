import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { deleteChatroomsByUserId } from "./chat";
const StudentUsersCollection = collection(db, 'Student');
const UsersCollection = collection(db, 'Users')

async function getStudentById(uid: string): Promise<Student> {
    const docRef = doc(StudentUsersCollection, uid);
    const docSnap = await getDoc(docRef);
    const student = docSnap.data();
    return student as Student;
}

async function getStudents(): Promise<Student[]> {
    try {
        const querySnapshot = await getDocs(StudentUsersCollection);
        const studentsList = querySnapshot.docs.map((doc) => {
            return { uid: doc.id, ...doc.data() } as Student;
        });
        return studentsList;
    } catch (error) {
        alert("Error getting students list: " + error);
        return [];
    }
}


async function addStudent(uid: string, displayName: string, photoUrl: string, email: string, county: string, personalStatement: string): Promise<boolean> {
    try {
        await addDoc(StudentUsersCollection, {
            uid,
            displayName,
            photoUrl,
            email,
            county,
            personalStatement
        })
        return true
    } catch (error) {
        alert("Error adding students: " + error);
        return false;
    }
}

async function updateStudentInfo(uid: string, displayName: string, email: string, county: string, personalStatement: string, experience: string, subjects: string[]): Promise<boolean> {
    try {
        const docRef = doc(StudentUsersCollection, uid);
        await updateDoc(docRef, {
            displayName,
            email,
            county,
            personalStatement,
            experience,
            subjects
        })
        return true;
    } catch (error) {
        alert("Error updating students: " + error);
        return false;
    }
}

async function deleteStudentById(uid:string): Promise<boolean> {
    try {
        const docRef = doc(StudentUsersCollection, uid);
        await deleteDoc(docRef);
        const userDocRef = doc(UsersCollection, uid)
        await deleteDoc(userDocRef)
        await deleteChatroomsByUserId(uid)
        return true;
    } catch (error) {
        alert("Error deleting student: " + error);
        return false;
    }
}

async function getStudentApplications(uid: string): Promise<Application[]> {
    try {
        const subCollectionRef = collection(doc(StudentUsersCollection, uid), 'applications');
        const querySnapshot = await getDocs(subCollectionRef);
        const applicationsList = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as Application;
        });
        return applicationsList;
    } catch (error) {
        alert("Error getting student applications: " + error);
        return [];
    }
}

async function getStudentReviews(uid: string): Promise<Review[]> {
    try {
        const subCollectionRef = collection(doc(StudentUsersCollection, uid), 'reviews');
        const querySnapshot = await getDocs(subCollectionRef);
        const reviewsList = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as Review;
        });
        return reviewsList;
    } catch (error) {
        alert("Error getting student reviews: " + error);
        return [];
    }
}

async function addReview(uid: string, businessId: string, rating: number, review: string, displayName: string): Promise<boolean> {
    try {
        const subCollectionRef = collection(doc(StudentUsersCollection, uid), 'reviews');
        await addDoc(subCollectionRef, {
            studentId: uid,
            businessId,
            rating,
            review,
            displayName
        })
        return true;
    } catch (error) {
        alert("Error adding review: " + error);
        return false;
    }
}

async function updateReviewByID(uid: string, reviewId: string, rating: number, review: string, displayName: string): Promise<boolean> {
    try {
        const subCollectionRef = collection(doc(StudentUsersCollection, uid), 'reviews');
        const docRef = doc(subCollectionRef, reviewId);
        await updateDoc(docRef, {
            rating,
            review,
            displayName
        })
        return true;
    } catch (error) {
        alert("Error updating review: " + error);
        return false;
    }
}

async function deleteReviewByID(uid: string, reviewId: string): Promise<boolean> {
    try {
        const subCollectionRef = collection(doc(StudentUsersCollection, uid), 'reviews');
        const docRef = doc(subCollectionRef, reviewId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        alert("Error deleting review: " + error);
        return false;
    }
}

export { getStudents, addStudent, getStudentById, updateStudentInfo, deleteStudentById, getStudentApplications, getStudentReviews, addReview, updateReviewByID, deleteReviewByID };

