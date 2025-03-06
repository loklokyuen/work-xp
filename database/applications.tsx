import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  doc,
  getDoc,
  query,
  where,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
const ApplicationsCollection = collection(db, "Applications");

async function addApplication(
  oppId: string,
  businessId: string,
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
      businessId,
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

async function getApplications(): Promise<Application1[]> {
  const querySnapshot = await getDocs(ApplicationsCollection);
  const applicationsList = querySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application1;
  });
  return applicationsList;
}

async function getApplicationsByBusinessId(
  businessId: string
): Promise<Application1[]> {
  const q = query(
    ApplicationsCollection,
    where("businessId", "==", businessId)
  );
  const QuerySnapshot = await getDocs(q);
  const applicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application1;
  });
  return applicationsList;
}

async function getApplicationsByOppId(oppId: string): Promise<Application1[]> {
  const q = query(ApplicationsCollection, where("oppId", "==", oppId));
  const QuerySnapshot = await getDocs(q);
  const applicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application1;
  });
  return applicationsList;
}

export {
  addApplication,
  getApplications,
  getApplicationsByBusinessId,
  getApplicationsByOppId,
};
