import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { View, ScrollView } from "react-native";
import { doc, getDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../../database/firebase";

import OpportunityCard from "@/components/OpportunityCard";

export default function ViewCurrentOpportunities() {
    const { user, setUser } = useUserContext();
    const [opportunities, setOpportunities] = useState<OpportunityCardProps[]>([]);

    useEffect(() => {
        if (user?.uid) {
            const collectionRef = collection(db, "Business", user.uid, "Opportunities");
            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                let opps: any[] = [];
                const data = snapshot.docs.map((doc) => {
                    opps.push({ id: doc.id, ...doc.data() });
                });
                setOpportunities(opps);
            });
            return () => {
                unsubscribe();
            };
        }
    }, [user?.uid]);

    return (
        <ScrollView>
            <View>
                {opportunities.map((opp, index) => {
                    return (
                        <OpportunityCard
                            key={index}
                            availability={opp.availability}
                            description={opp.description}
                            jobRole={opp.jobRole}
                            id={opp.id}
                        />
                    );
                })}
            </View>
        </ScrollView>
    );
}
