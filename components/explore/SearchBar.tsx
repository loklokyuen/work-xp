import * as React from "react";
import { Searchbar } from "react-native-paper";
import { View } from "react-native";

interface SearchBarProps {
  businesses: {
    displayName: string;
    location: string;
    photoUrl: string;
  }[];
  handleBusinessSelect: (
    business: {
      displayName: string;
      location: string;
      photoUrl: string;
    } | null
  ) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  businesses,
  handleBusinessSelect,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      handleBusinessSelect(null);
      return;
    }

    const matchedBusiness = businesses.find((biz) =>
      biz.displayName.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedBusiness) {
      handleBusinessSelect(matchedBusiness);
    }
  };

  return (
    <View>
      <Searchbar
        placeholder="Search for a business..."
        onChangeText={handleSearch}
        value={searchQuery}
      />
    </View>
  );
};

export default SearchBar;
