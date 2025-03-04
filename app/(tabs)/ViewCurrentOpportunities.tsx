import { useState, useContext, useEffect } from "react";

import { useUserContext } from "../../context/UserContext";
import BusinessCalenderPost from "@/components/Calendar/CalendarBusinessPost";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  addDoc,
  getDocs,
  query,
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/database/firebase";

import OpportunityCard from "@/components/OpportunityCard";

interface OpportunityCardProps {
  Availability: string;
  Description: string;
  "Job role": string;
}

export default function ViewCurrentOpportunities() {
  const { user, setUser } = useUserContext();
  const [opportunities, setOpportunities] = useState<OpportunityCardProps[]>(
    []
  );

  useEffect(() => {
    const fetchOpportunities = async () => {
      const docRef = doc(db, "Business", user.uid);

      const docSnap = await getDoc(docRef);

      const data = docSnap.data();

      if (data) {
        const opps = data.Opportunities;
        setOpportunities(opps);
      }
    };
    fetchOpportunities();
  }, []);

  console.log(opportunities);

  //   const opportunities = [
  //     {
  //       Availability: "2025-03-17 --> 2025-03-21",
  //       Description: "Exciting opportunity to work on innovative projects.",
  //       JobRole: "Software Engineer",
  //     },
  //   ];

  return (
    <ScrollView>
      <View>
        {opportunities &&
          opportunities.map((opp, index) => {
            return (
              <OpportunityCard
                key={index}
                Availability={opp.Availability}
                Description={opp.Description}
                JobRole={opp["Job role"]}
              />
            );
          })}
      </View>
    </ScrollView>
  );
}
