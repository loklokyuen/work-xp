import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PaperProvider } from "react-native-paper";
import BusinessCards from "./BusinessCards";
import styles from "@/app/styles";
import SearchBar from "./SearchBar";
import {
  getBusinesses,
  getBusinessBySector,
  getBusinessByCounty,
} from "@/database/business";
import SectorDropdown from "./SectorDropdown";
import CountyDropdown from "./CountyDropdown";

const BusinessList: React.FC = () => {
  interface IndividualBusiness {
    displayName: string;
    county: string;
    photoUrl: string;
    sector: string;
  }

  const [businesses, setBusinesses] = useState<IndividualBusiness[]>([]);
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

  const filteredBusinesses = businesses.filter((biz) =>
    biz.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PaperProvider>
      <ScrollView>
        <View style={styles.searchContainer}>
          <SearchBar setSearchQuery={setSearchQuery} />
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
            {loading ? (
              <Text>Loading businesses...</Text>
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
    </PaperProvider>
  );
};

export default BusinessList;
