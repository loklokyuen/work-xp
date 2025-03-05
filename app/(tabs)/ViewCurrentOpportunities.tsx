import { useState, useContext, useEffect } from "react";

import { useUserContext } from "../../context/UserContext";
import BusinessCalenderPost from "@/components/Calendar/CalendarBusinessPost";
import { View, ScrollView } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../database/firebase";

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
    const docRef = doc(db, "Business", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      const data = docSnap.data();

      if (data) {
        const opps = data.Opportunities;
        setOpportunities(opps);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
