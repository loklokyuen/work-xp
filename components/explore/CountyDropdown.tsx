import React from "react";
import { View } from "react-native";
import { Menu, Button } from "react-native-paper";

interface CountyDropdownProps {
  selectedCounty: string | null; // Change this to track county
  setSelectedCounty: (county: string | null) => void; // Update setter to handle counties
  counties: string[]; // This should be passed as a prop (you will need to fetch counties from businesses)
}

const CountyDropdown: React.FC<CountyDropdownProps> = ({
  selectedCounty,
  setSelectedCounty,
  counties,
}) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button onPress={() => setVisible(true)}>
            {selectedCounty
              ? `Filtered by County: ${selectedCounty}`
              : "Filter by County"}
          </Button>
        }
      >
        {counties.map((county) => (
          <Menu.Item
            key={county}
            onPress={() => {
              setSelectedCounty(county);
              setVisible(false);
            }}
            title={county}
          />
        ))}
        <Menu.Item
          key="clear"
          onPress={() => {
            setSelectedCounty(null);
            setVisible(false);
          }}
          title="All Counties"
        />
      </Menu>
    </View>
  );
};

export default CountyDropdown;
