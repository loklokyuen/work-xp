import * as React from "react";
import { Searchbar, useTheme } from "react-native-paper";
import { View } from "react-native";

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
  placeholder: string;
  isBusinessSearch: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  setSearchQuery,
}) => {
  const [searchQuery, setQuery] = React.useState("");
  const { colors, fonts } = useTheme();

  const handleSearch = (query: string) => {
    setQuery(query);
    setSearchQuery(query); // Pass the entire string, spaces included
  };

  return (
    <View>
      <Searchbar
        placeholder={placeholder}
        inputStyle={{ ...fonts.bodyMedium }}
        onChangeText={handleSearch}
        value={searchQuery}
      />
    </View>
  );
};

export default SearchBar;
