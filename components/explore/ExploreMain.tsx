import { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";
import BusinessList from "./BusinessList";
import styles from "@/app/styles";
import {
  getBusinesses,
  getBusinessBySector,
  getBusinessByCounty,
} from "@/database/business";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/database/firebase";
import OpportunitiesList from "./OpportunitiesList";

const ExploreMain = () => {
  const [searchType, setSearchType] = useState("Business");
  const { colors, fonts } = useTheme();

  interface IndividualBusiness {
    uid: string;
    displayName: string;
    county: string;
    photoUrl: string;
    sector: string;
  }

  const [businesses, setBusinesses] = useState<IndividualBusiness[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedBusinesses = await getBusinesses();
        setBusinesses(fetchedBusinesses);
        const fetchedSectors = [
          ...new Set(fetchedBusinesses.map((biz) => biz.sector)),
        ].filter((sector) => sector && sector.trim() !== "");
        setSectors(fetchedSectors);

        const fetchedCounties = [
          ...new Set(fetchedBusinesses.map((biz) => biz.county)),
        ].filter((county) => county && county.trim() !== "");
        setCounties(fetchedCounties);
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredBusinesses = async () => {
      setLoading(true);
      try {
        let filteredBusinesses = await getBusinesses();

        if (selectedCounty) {
          filteredBusinesses = await getBusinessByCounty(selectedCounty);
        }

        if (selectedSector) {
          filteredBusinesses = await getBusinessBySector(selectedSector);
        }

        if (selectedCounty && selectedSector) {
          filteredBusinesses = filteredBusinesses.filter(
            (biz) =>
              biz.county === selectedCounty && biz.sector === selectedSector
          );
        }

        setBusinesses(filteredBusinesses);
      } catch (err) {
        console.error("Error fetching filtered businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredBusinesses();
  }, [selectedSector, selectedCounty]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const fetchedOpportunities = await getDocs(
          collection(db, "Opportunities")
        );
        const opportunitiesData = fetchedOpportunities.docs.map((doc) =>
          doc.data()
        );
        setOpportunities(opportunitiesData);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredBusinesses = businesses
    .filter((biz) => biz.displayName && biz.photoUrl)
    .filter((biz) =>
      biz.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <ScrollView>
      <View style={styles.searchButtonContainer}>
        <Button
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.onPrimary,
          }}
          onPress={() => setSearchType("Business")}
        >
          Search by Business
        </Button>
        <Button
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 15,
          }}
          labelStyle={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: "normal",
            color: colors.onPrimary,
          }}
          onPress={() => setSearchType("Opportunity")}
        >
          Search by Opportunity
        </Button>
      </View>
      {searchType === "Business" ? (
        <BusinessList
          businesses={filteredBusinesses}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sectors={sectors}
          counties={counties}
          selectedSector={selectedSector}
          selectedCounty={selectedCounty}
          setSelectedSector={setSelectedSector}
          setSelectedCounty={setSelectedCounty}
        />
      ) : (
        <OpportunitiesList
          opportunities={opportunities}
          businesses={businesses}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sectors={sectors}
          counties={counties}
          selectedSector={selectedSector}
          selectedCounty={selectedCounty}
          setSelectedSector={setSelectedSector}
          setSelectedCounty={setSelectedCounty}
        />
      )}
    </ScrollView>
  );
};

export default ExploreMain;
