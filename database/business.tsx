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
  arrayUnion,
} from "firebase/firestore";

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
    doc(db, "Business", uid),
    "Opportunities"
  );
  const querySnapshot = await getDocs(subCollectionRef);
  const opportunitiesList = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as Opportunity;
  });
  return opportunitiesList;
}

async function getBusinessOpportunityById(
  uid: string,
  opportunityId: string
): Promise<Opportunity> {
  const docRef = doc(db, "Business", uid, "Opportunities", opportunityId);
  const docSnap = await getDoc(docRef);
  const opportunity = docSnap.data();
  return opportunity as Opportunity;
}

async function getAvailabilitiesByOpportunity(
  uid: string,
  opportunityId: string
): Promise<any[]> {
  const subCollectionRef = collection(
    doc(db, "Business", uid),
    "Opportunities",
    opportunityId,
    "Availabilities"
  );
  const querySnapshot = await getDocs(subCollectionRef);
  const applicationsList = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as any;
  });
  return applicationsList;
}

async function updateBusinesInfo(
  uid: string,
  displayName: string,
  email: string,
  county: string,
  description: string,
  phoneNumber: string,
  sector: string,
  address: string
): Promise<boolean> {
  try {
    const docRef = doc(BusinessUsersCollection, uid);
    await updateDoc(docRef, {
      displayName,
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

async function postReview(
  businessId: string,
  review: string,
  stars: number,
  studentName: string | undefined
): Promise<boolean> {
  try {
    const docRef = doc(BusinessUsersCollection, businessId);

    await updateDoc(docRef, {
      reviews: arrayUnion({ review, stars, studentName }),
    });
    return true;
  } catch (error) {
    alert("Error posting review" + error);
    return false;
  }
}

// async function getBusinessReviews(
//   businessId: string
// ): Promise<Review[]> {
//   try {
//     const docRef = doc(BusinessUsersCollection, businessId);

//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       console.log(data);
//       return data as Review;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.log("Error getting reviews" + error);
//   }
// }

async function getBusinessReviews(
  businessId: string
): Promise<Review[] | null> {
  try {
    const docRef = doc(BusinessUsersCollection, businessId);

    const docSnap = await getDoc(docRef);

    const data = docSnap.data();
    if (data) {
      return data.reviews as Review[];
    } else return null;
  } catch (error) {
    console.log("Error getting reviews:" + error);
    return null;
  }
}

export {
  getBusinessById,
  getBusinesses,
  getBusinessBySector,
  getBusinessOpportunities,
  getBusinessOpportunityById,
  getBusinessByCounty,
  updateBusinesInfo,
  getAvailabilitiesByOpportunity,
  postReview,
  getBusinessReviews,
};
