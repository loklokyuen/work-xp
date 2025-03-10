import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  QuerySnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
const ApplicationsCollection = collection(db, "Applications");

// async function addApplication(
//     oppId: string,
//     businessId: string,
//     studentId: string,
//     datesApplied: string[],
//     whyApply: string,
//     whySuitable: string
// ): Promise<boolean> {
//     try {
//         const docRef = await addDoc(ApplicationsCollection, {
//             oppId,
//             businessId,
//             studentId,
//             datesApplied,
//             whyApply,
//             whySuitable,
//         });

//         await updateDoc(doc(db, "Applications", docRef.id), {
//             uid: docRef.id,
//         });

//         console.log("Application added with uid:", docRef.id);
//         return true;
//     } catch (error) {
//         alert("Error adding application: " + error);
//         return false;
//     }
// }

async function addApplication(
  oppId: string,
  businessId: string,
  datesApplied: Record<string, any>,
  studentId: string,
  whyApply: string,
  whySuitable: string,
  personalStatement: string,
  experience: string,
  subjects: string,
  displayName: string,
  photoUrl: string,
  businessName: string
): Promise<boolean> {
  try {
    const docRef = await addDoc(ApplicationsCollection, {
      oppId,
      businessId,
      datesApplied,
      studentId,
      whyApply,
      whySuitable,
      personalStatement,
      experience,
      subjects,
      displayName,
      photoUrl,
      businessName,
    });

    await updateDoc(doc(db, "Applications", docRef.id), {
      uid: docRef.id,
    });

    console.log("Application added with uid:", docRef.id);
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

async function getAcceptedApplicationsByBusinessId(
  businessId: string
): Promise<Application1[]> {
  const q = query(
    ApplicationsCollection,
    where("businessId", "==", businessId),
    where("isAccepted", "==", true)
  );
  const QuerySnapshot = await getDocs(q);
  const AcceptedApplicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application1;
  });
  return AcceptedApplicationsList;
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

async function getApplicationByStudentId(
  studentId: string
): Promise<Application1[]> {
  const q = query(ApplicationsCollection, where("studentId", "==", studentId));
  const QuerySnapshot = await getDocs(q);
  const applicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application1;
  });
  return applicationsList;
}

async function updateApplicationAccepted(
  appId: string,
  boolean: boolean
): Promise<boolean> {
  try {
    const docRef = doc(ApplicationsCollection, appId);
    if (boolean) {
      await updateDoc(docRef, {
        isAccepted: true,
      });
    }
    if (!boolean) {
      await updateDoc(docRef, {
        isAccepted: false,
      });
    }

    return true;
  } catch (error) {
    alert("Error accepting application" + error);
    return false;
  }
}

async function deleteApplicationsById(uid:string): Promise<boolean> {
  try {
      const docRef = doc(ApplicationsCollection, uid);
      await deleteDoc(docRef);
      return true;
  } catch (error) {
      alert("Error deleting application: " + error);
      return false;
  }
}

export {
  addApplication,
  getApplications,
  getAcceptedApplicationsByBusinessId,
  getApplicationsByBusinessId,
  getApplicationsByOppId,
  updateApplicationAccepted,
  getApplicationByStudentId,
  deleteApplicationsById,
};
