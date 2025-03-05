import { View, Text, ScrollView } from "react-native";
import BusinessCards from "./BusinessCards";
import styles from "@/app/styles";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import { getBusinesses } from "@/database/business";

const BusinessList: React.FC = () => {
  interface IndividualBusiness {
    displayName: string;
    county: string;
    sector: string;
    photoUrl: string;
  }

  const [businesses, setBusinesses] = useState<IndividualBusiness[]>([]);
  const [filteredBusiness, setFilteredBusinesses] = useState<
    IndividualBusiness[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCounty, setSelectedCounty] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBusinesses = await getBusinesses();
        setBusinesses(fetchedBusinesses);
        setFilteredBusinesses(fetchedBusinesses);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBusinessSelect = (
    selectedBusiness: IndividualBusiness | null
  ) => {
    if (selectedBusiness) {
      setFilteredBusinesses([selectedBusiness]);
    } else {
      setFilteredBusinesses(businesses);
    }
  };

  return (
    <ScrollView>
      <View style={styles.searchContainer}>
        <SearchBar
          businesses={businesses}
          handleBusinessSelect={handleBusinessSelect}
        />
        <View>
          {loading ? (
            <Text>Loading businesses...</Text>
          ) : filteredBusiness.length > 0 ? (
            filteredBusiness.map((biz, index) => (
              <BusinessCards
                key={index}
                displayName={biz.displayName}
                county={biz.county}
                photoUrl={biz.photoUrl}
              />
            ))
          ) : (
            <Text>No businesses found.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default BusinessList;
