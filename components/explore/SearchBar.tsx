import * as React from "react";
import { Searchbar } from "react-native-paper";
import { View } from "react-native";

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery }) => {
  const [searchQuery, setQuery] = React.useState("");

  const handleSearch = (query: string) => {
    setQuery(query);
    setSearchQuery(query); // Updates `searchQuery` in `BusinessList`
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
