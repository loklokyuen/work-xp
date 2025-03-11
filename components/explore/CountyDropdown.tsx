import React from "react";
import { View } from "react-native";
import { Menu, Button } from "react-native-paper";

interface CountyDropdownProps {
  selectedCounty: string | null;
  setSelectedCounty: (county: string | null) => void;
  counties: string[];
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
          <Button
            labelStyle={{ fontFamily: "Lato" }}
            onPress={() => setVisible(true)}
          >
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
