
import { collection, addDoc, getDocs, getFirestore, doc, getDoc, query, where, updateDoc } from "firebase/firestore";

import { db } from "./firebase";
const BusinessUsersCollection = collection(db, "Business");

async function getBusinessById(uid: string): Promise<Business> {
    const docRef = doc(BusinessUsersCollection, uid);
    const docSnap = await getDoc(docRef);
    const business = docSnap.data();
    return business as Business;
}

async function getBusinesses(): Promise<Business[]> {
    const querySnapshot = await getDocs(BusinessUsersCollection);
    const businessesList = querySnapshot.docs.map((doc) => {
        return { uid: doc.id, ...doc.data() } as Business;
    });
    return businessesList;
}

async function getBusinessBySector(sector: string): Promise<Business[]> {
  const q = query(BusinessUsersCollection, where("sector", "==", sector));
  const querySnapshot = await getDocs(q);
  const businessesList = querySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Business;
  });
  return businessesList;
}

async function getBusinessOpportunities(uid: string): Promise<Opportunity[]> {
  const subCollectionRef = collection(
    doc(db, "Business", uid), "Opportunities"
  );
  const querySnapshot = await getDocs(subCollectionRef);
  const opportunitiesList = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Opportunity;
  });
  return opportunitiesList;
}

async function getBusinessOpportunityById(uid: string, opportunityId: string): Promise<Opportunity> {
  const docRef = doc(db, "Business", uid, "Opportunities", opportunityId);
  const docSnap = await getDoc(docRef);
  const opportunity = docSnap.data();
  return opportunity as Opportunity;
}

async function getAvailabilitiesByOpportunity(uid: string, opportunityId: string): Promise<any[]> {
    const subCollectionRef = collection(doc(db, "Business", uid), "Opportunities", opportunityId, "Availabilities");
    const querySnapshot = await getDocs(subCollectionRef);
    const applicationsList = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as any;
    });
    console.log(applicationsList);
    return applicationsList;
}

async function updateBusinesInfo(uid: string, email: string, county: string, description: string, phoneNumber: string, sector: string, address: string): Promise<boolean> {
    try {
        const docRef = doc(BusinessUsersCollection, uid);
        await updateDoc(docRef, {
            email,
            county,
            description,
            phoneNumber,
            sector,
            address,
        });
        return true;
    } catch (error) {
        alert("Error updating business: " + error);
        return false;
    }
    
}

async function getBusinessByCounty(county: string): Promise<Business[]> {
  const q = query(BusinessUsersCollection, where("county", "==", county));
  const querySnapshot = await getDocs(q);
  const businessesList = querySnapshot.docs.map((doc) => {
    return { uid: doc.id, ...doc.data() } as Business;
  });
  return businessesList;
}

export {
  getBusinessById,
  getBusinesses,
  getBusinessBySector,
  getBusinessOpportunities,
  getBusinessOpportunityById,
  getBusinessByCounty,
  updateBusinesInfo,
  getAvailabilitiesByOpportunity
};
