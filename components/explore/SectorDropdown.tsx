import React from "react";
import { View } from "react-native";
import { Menu, Button } from "react-native-paper";

interface SectorDropdownProps {
  selectedSector: string | null;
  setSelectedSector: (sector: string | null) => void;
  sectors: string[];
}

const SectorDropdown: React.FC<SectorDropdownProps> = ({
  selectedSector,
  setSelectedSector,
  sectors,
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
            {selectedSector
              ? `Filtered by Sector: ${selectedSector}`
              : "Filter by Sector"}
          </Button>
        }
      >
        {sectors.map((sector) => (
          <Menu.Item
            key={sector}
            onPress={() => {
              setSelectedSector(sector);
              setVisible(false);
            }}
            title={sector}
          />
        ))}
        <Menu.Item
          key="clear"
          onPress={() => {
            setSelectedSector(null);
            setVisible(false);
          }}
          title="All Sectors"
        />
      </Menu>
    </View>
  );
};

export default SectorDropdown;
