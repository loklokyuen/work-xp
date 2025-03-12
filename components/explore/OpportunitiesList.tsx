import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import styles from "@/app/styles";
import SectorDropdown from "./SectorDropdown";
import CountyDropdown from "./CountyDropdown";
import OpportunityCard from "./OpportunityCard";
import SearchBar from "./SearchBar";

const OpportunitiesList: React.FC<{
  opportunities: any[];
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
  opportunities,
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
  const opportunitiesWithBusinessInfo = opportunities.map((opp) => {
    const business = businesses.find((b) => b.uid === opp.businessId);
    return { ...opp, business };
  });

  const filteredOpportunities = opportunitiesWithBusinessInfo.filter((opp) => {
    const { business, jobRole } = opp;

    const matchesSearchQuery =
      jobRole && jobRole.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      !selectedSector || (business && business.sector === selectedSector);

    const matchesCounty =
      !selectedCounty || (business && business.county === selectedCounty);

    return matchesSearchQuery && matchesSector && matchesCounty;
  });

  return (
    <ScrollView>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search for an opportunity..."
          setSearchQuery={setSearchQuery}
          isBusinessSearch={false}
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
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp, index) => (
              <OpportunityCard key={index} opp={opp} />
            ))
          ) : (
            <Text>No opportunities found.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default OpportunitiesList;
