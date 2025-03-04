import { View, Text, ScrollView } from "react-native";
import BusinessCards from "./BusinessCards";
import styles from "@/app/styles";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { db } from "@/database/firebase";

const BusinessList: React.FC = () => {
  interface IndividualBusiness {
    displayName: string;
    location: string;
    photoUrl: string;
  }

  const allBusinesses: IndividualBusiness[] = [
    {
      displayName: "R&J Mechanics",
      location: "Sydney",
      photoUrl:
        "https://www.cityofbristol.ac.uk/wp-content/uploads/Motor-Vehicle-small-scaled.jpg",
    },
    {
      displayName: "Aardman",
      location: "UK",
      photoUrl:
        "https://i0.wp.com/lomokev.com/wp-content/uploads/2014/03/aardman-animation-12-02-24-eos5D-mrk2-6027.jpg?fit=900%2C600&ssl=1",
    },
    {
      displayName: "Riverside Garden Centre",
      location: "UK",
      photoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBTmtgpkm8OcEHUjmBO3Lb3_195Nuyz6AE7A&s",
    },
    {
      displayName: "Google",
      location: "USA",
      photoUrl:
        "https://static1.thetravelimages.com/wordpress/wp-content/uploads/2023/04/google-headquarters-mountain-view-california.jpg",
    },
    {
      displayName: "Apple",
      location: "USA",
      photoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Tz8UoGGrGnT_GvfPoHjOBGw4Q-QWACEJhw&s",
    },
  ];

  const [filteredBusiness, setFilteredBusinesses] =
    useState<IndividualBusiness[]>(allBusinesses);

  const handleBusinessSelect = (
    selectedBusiness: IndividualBusiness | null
  ) => {
    if (selectedBusiness) {
      setFilteredBusinesses([selectedBusiness]);
    } else {
      setFilteredBusinesses(allBusinesses);
    }
  };

  return (
    <ScrollView>
      <View style={styles.searchContainer}>
        <SearchBar
          businesses={allBusinesses}
          handleBusinessSelect={handleBusinessSelect}
        />
        <View style={styles.cardContainer}>
          {filteredBusiness.length > 0 ? (
            filteredBusiness.map((biz, index) => (
              <BusinessCards
                key={index}
                displayName={biz.displayName}
                location={biz.location}
                photoUrl={biz.photoUrl}
              />
            ))
          ) : (
            <Text>Loading business...</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default BusinessList;
