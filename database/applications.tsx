import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
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
  subjects: string[],
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
    return true;
  } catch (error) {
    return false;
  }
}

async function getApplications(): Promise<Application[]> {
  const querySnapshot = await getDocs(ApplicationsCollection);
  const applicationsList = querySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application;
  });
  return applicationsList;
}

async function getAcceptedApplicationsByBusinessId(
  businessId: string
): Promise<Application[]> {
  const q = query(
    ApplicationsCollection,
    where("businessId", "==", businessId),
    where("isAccepted", "==", true)
  );
  const QuerySnapshot = await getDocs(q);
  const AcceptedApplicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application;
  });
  return AcceptedApplicationsList;
}

async function getApplicationsByBusinessId(
  businessId: string
): Promise<Application[]> {
  const q = query(
    ApplicationsCollection,
    where("businessId", "==", businessId)
  );
  const QuerySnapshot = await getDocs(q);
  const applicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application;
  });
  return applicationsList;
}

async function getApplicationsByOppId(oppId: string): Promise<Application[]> {
  const q = query(ApplicationsCollection, where("oppId", "==", oppId));
  const QuerySnapshot = await getDocs(q);
  const applicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application;
  });
  return applicationsList;
}

async function getApplicationByStudentId(
  studentId: string
): Promise<Application[]> {
  const q = query(ApplicationsCollection, where("studentId", "==", studentId));
  const QuerySnapshot = await getDocs(q);
  const applicationsList = QuerySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Application;
  });
  return applicationsList;
}

async function checkApplicationExists(studentId:string, oppId: string): Promise<boolean> {
  const q = query(ApplicationsCollection, where("studentId", "==", studentId), where("oppId", "==", oppId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length === 0) {
    return false;
  }
  return true;
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

async function updateReviewPosted(
  appId: string,
  boolean: boolean
): Promise<boolean> {
  try {
    const docRef = doc(ApplicationsCollection, appId);
    if (boolean) {
      await updateDoc(docRef, {
        reviewPosted: true,
      });
    }
    if (!boolean) {
      await updateDoc(docRef, {
        reviewPosted: false,
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
  checkApplicationExists,
  updateApplicationAccepted,
  getApplicationByStudentId,
  deleteApplicationsById,
  updateReviewPosted,
};
