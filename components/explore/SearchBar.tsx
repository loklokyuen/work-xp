import * as React from "react";
import { Searchbar, useTheme } from "react-native-paper";
import { View } from "react-native";

interface SearchBarProps {
    setSearchQuery: (query: string) => void;
    placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, setSearchQuery }) => {
    const [searchQuery, setQuery] = React.useState("");
    const { colors, fonts } = useTheme();

    const handleSearch = (query: string) => {
        const trimmedQuery = query.trim();
        setQuery(trimmedQuery);
        setSearchQuery(trimmedQuery);
    };

    return (
        <View>
            <Searchbar placeholder={placeholder} inputStyle={{ ...fonts.bodyMedium }} onChangeText={handleSearch} value={searchQuery} />
        </View>
    );
};

export default SearchBar;
