import {
    collection,
    doc,
    updateDoc,
    setDoc,
  } from "firebase/firestore";
  
  import { db } from "./firebase";
  const OpportunitiesCollection = collection(db, "Opportunities");

  async function addOpportunity(opportunityId:string, businessId: string, businessName: string, jobRole: string, description: string, subjects: string[]): Promise<boolean> {
    try {
       await setDoc(doc(db, "Opportunities", opportunityId), {
        businessId,
        businessName,
        jobRole,
        description,
        subjects,
      });
      return true;
    } catch (error) {
      alert("Error adding opportunity: " + error);
      return false;
    }
  }

  async function updateOpportunity(opportunityId: string, jobRole: string, description: string, subjects: string[]): Promise<boolean> {
    try {
      const docRef = doc(OpportunitiesCollection, opportunityId);
      await updateDoc(docRef, {
        description,
        jobRole,
        subjects,
      });
      return true;
    } catch (error) {
      alert("Error updating opportunity: " + error);
      return false;
    }
  }

  export { addOpportunity, updateOpportunity };