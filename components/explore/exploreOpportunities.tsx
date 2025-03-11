import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { PaperProvider } from "react-native-paper";
import BusinessCards from "./BusinessCards";
import styles from "@/app/styles";
import SearchBar from "./SearchBar";
import { getBusinesses, getBusinessBySector, getBusinessByCounty, getBusinessOpportunities } from "@/database/business";
import SectorDropdown from "./SectorDropdown";
import CountyDropdown from "./CountyDropdown";
import OpportunityCard from "./OpportunityCard";
import { getDocs, collection, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/database/firebase";
import { getStudentById } from "@/database/student";
import { useUserContext } from "@/context/UserContext";

const OpportunityList: React.FC = () => {
    interface IndividualBusiness {
        uid: string;
        displayName: string;
        county: string;
        photoUrl: string;
        sector: string;
    }
    interface Opportunity {
        id: string;
        jobRole: string;
        description: string;
        businessId: string;
        businessName: string;
        sim: number;
    }

    const { user } = useUserContext();
    const [businesses, setBusinesses] = useState<IndividualBusiness[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [sectors, setSectors] = useState<string[]>([]);
    const [counties, setCounties] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    function similarity(studentSubs: string[], oppSubs: string[]) {
        if (oppSubs) {
            const common = studentSubs.filter((sub) => oppSubs.includes(sub)).length;
            return common / Math.sqrt(oppSubs.length);
        }
        return 0;
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedOpportunities = await getDocs(collection(db, "Opportunities"));
                const opps: Opportunity[] = [];
                const student = await getStudentById(user?.uid);
                for (let opp of fetchedOpportunities.docs) {
                    const data = opp.data();
                    const sim = similarity(student.subjects, data.subjects);
                    opps.push({ ...opp.data(), sim } as Opportunity);
                }
                setOpportunities(opps);
                setOpportunities(opps.sort((a, b) => b.sim - a.sim));
                // setOpportunities(fetchedOpportunities);
                // const fetchedBusinesses = await getBusinesses();
                // setBusinesses(fetchedBusinesses);
                // for (let business of fetchedBusinesses) {
                //     const fetchedOpportunities = await getBusinessOpportunities(business.uid);
                //     setOpportunities((prevOpportunities) => [
                //         ...prevOpportunities,
                //         ...fetchedOpportunities.map((opportunity) => ({
                //             ...opportunity,
                //             businessId: business.uid,
                //             businessName: business.displayName,
                //         })),
                //     ]);
                // }

                // const fetchedSectors = [...new Set(fetchedBusinesses.map((biz) => biz.sector))].filter((sector) => sector && sector.trim() !== "");
                // setSectors(fetchedSectors);

                // const fetchedCounties = [...new Set(fetchedBusinesses.map((biz) => biz.county))].filter((county) => county && county.trim() !== "");
                // setCounties(fetchedCounties);
            } catch (err) {
                console.error("Error fetching businesses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     const fetchFilteredBusinesses = async () => {
    //         setLoading(true);
    //         try {
    //             let filteredBusinesses = await getBusinesses();

    //             if (selectedCounty) {
    //                 filteredBusinesses = await getBusinessByCounty(selectedCounty);
    //             }

    //             if (selectedSector) {
    //                 filteredBusinesses = await getBusinessBySector(selectedSector);
    //             }

    //             if (selectedCounty && selectedSector) {
    //                 filteredBusinesses = filteredBusinesses.filter((biz) => biz.county === selectedCounty && biz.sector === selectedSector);
    //             }

    //             setBusinesses(filteredBusinesses);
    //         } catch (err) {
    //             console.error("Error fetching filtered businesses:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchFilteredBusinesses();
    // }, [selectedSector, selectedCounty]);

    const filteredBusinesses = businesses
        .filter((biz) => biz.displayName && biz.photoUrl)
        .filter((biz) => biz.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <ScrollView>
            <Text variant="titleLarge" style={{ textAlign: "center", margin: 15, paddingTop: 10 }}>
                Top Picks
            </Text>
            <View style={styles.searchContainer}>
                <SearchBar placeholder="Search for an opportunity..." setSearchQuery={setSearchQuery} />
                <SectorDropdown selectedSector={selectedSector} setSelectedSector={setSelectedSector} sectors={sectors} />
                <CountyDropdown selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} counties={counties} />
                <View>
                    {loading ? (
                        <Text>Loading businesses...</Text>
                    ) : opportunities.length > 0 ? (
                        opportunities.map((opp, index) => (
                            // <Text>hello</Text>
                            <OpportunityCard key={index} opp={opp} />
                        ))
                    ) : (
                        <Text>No businesses found.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default OpportunityList;
