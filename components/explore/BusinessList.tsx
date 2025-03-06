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
    photoUrl: string;
  }

  const [businesses, setBusinesses] = useState<IndividualBusiness[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBusinesses = await getBusinesses();
        setBusinesses(fetchedBusinesses);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBusinesses = businesses.filter((biz) =>
    biz.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView>
      <View style={styles.searchContainer}>
        <SearchBar setSearchQuery={setSearchQuery} />
        <View>
          {loading ? (
            <Text>Loading businesses...</Text>
          ) : error ? (
            <Text>Error loading businesses. Please try again later.</Text>
          ) : filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((biz, index) => (
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
