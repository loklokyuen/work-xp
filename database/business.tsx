import { collection, addDoc, getDocs, getFirestore, doc, getDoc, query, where, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
const BusinessUsersCollection = collection(db, "Business");

async function getBusinessById(uid: string): Promise<Business> {
    const docRef = doc(db, "Business", uid);
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
    const subCollectionRef = collection(db, "Business", uid, "Opportunities");
    const querySnapshot = await getDocs(subCollectionRef);
    const opportunitiesList = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Opportunity;
    });
    return opportunitiesList;
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

export { getBusinessById, getBusinesses, getBusinessBySector, getBusinessOpportunities, updateBusinesInfo };
