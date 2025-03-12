import React from "react";
import { View, Text, ScrollView } from "react-native";
import BusinessCards from "./BusinessCards";
import styles from "@/app/styles";
import SearchBar from "./SearchBar";
import SectorDropdown from "./SectorDropdown";
import CountyDropdown from "./CountyDropdown";

const BusinessList: React.FC<{
  businesses: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sectors: string[];
  counties: string[];
  selectedSector: string | null;
  selectedCounty: string | null;
  setSelectedSector: (sector: string | null) => void;
  setSelectedCounty: (county: string | null) => void;
}> = ({
  businesses,
  searchQuery,
  setSearchQuery,
  sectors,
  counties,
  selectedSector,
  selectedCounty,
  setSelectedSector,
  setSelectedCounty,
}) => {
  const filteredBusinesses = businesses
    .filter((biz) => biz.displayName && biz.photoUrl)
    .filter((biz) =>
      biz.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <ScrollView>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search for a business..."
          setSearchQuery={setSearchQuery}
          isBusinessSearch={true}
        />
        <SectorDropdown
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          sectors={sectors}
        />
        <CountyDropdown
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          counties={counties}
        />
        <View>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((biz, index) => (
              <BusinessCards
                key={index}
                uid={biz.uid}
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
