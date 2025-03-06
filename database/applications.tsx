import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
const ApplicationsCollection = collection(db, "Applications");

async function addApplication(
  oppId: string,
  datesApplied: Record<string, any>,
  studentId: string,
  whyApply: string,
  whySuitable: string,
  personalStatement: string,
  experience: string,
  subjects: string
): Promise<boolean> {
  try {
    await addDoc(ApplicationsCollection, {
      oppId,
      datesApplied,
      studentId,
      whyApply,
      whySuitable,
      personalStatement,
      experience,
      subjects,
    });
    return true;
  } catch (error) {
    alert("Error adding application: " + error);
    return false;
  }
}

export { addApplication };
