import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { View, ScrollView } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../database/firebase";

import OpportunityCard from "@/components/OpportunityCard";

export default function ViewCurrentOpportunities() {
    const { user, setUser } = useUserContext();
    const [opportunities, setOpportunities] = useState<OpportunityCardProps[]>([]);

    useEffect(() => {
        if (user.uid) {
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
        }
    }, []);

    return (
        <ScrollView>
            <View>
                {opportunities &&
                    opportunities.map((opp, index) => {
                        return (
                            <OpportunityCard key={index} Availability={opp.Availability} Description={opp.Description} JobRole={opp["Job role"]} />
                        );
                    })}
            </View>
        </ScrollView>
    );
}
