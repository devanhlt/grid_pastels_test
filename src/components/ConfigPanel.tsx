import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { GridConfig } from "../types";
import { Ionicons } from "@expo/vector-icons";

const COLOR_OPTIONS = [
  { name: "Red", code: "#FF5252" },
  { name: "Pink", code: "#FF4081" },
  { name: "Purple", code: "#7C4DFF" },
  { name: "Indigo", code: "#536DFE" },
  { name: "Blue", code: "#448AFF" },
  { name: "Light Blue", code: "#40C4FF" },
  { name: "Cyan", code: "#18FFFF" },
  { name: "Teal", code: "#64FFDA" },
  { name: "Green", code: "#69F0AE" },
  { name: "Light Green", code: "#B2FF59" },
  { name: "Lime", code: "#EEFF41" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Amber", code: "#FFD740" },
  { name: "Orange", code: "#FFAB40" },
  { name: "Deep Orange", code: "#FF6E40" },
];

interface ConfigPanelProps {
  config: GridConfig;
  onConfigChange: (config: Partial<GridConfig>) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange,
}) => {
  const [tempRow, setTempRow] = useState(config.rows.toString());
  const [tempColumn, setTempColumn] = useState(config.columns.toString());
  const [tempGap, setTempGap] = useState(config.gap.toString());

  const handleSizeChange = (text: string) => {
    setTempRow(text);
    setTempColumn(text);
    const size = parseInt(text);
    onConfigChange({
      columns: !isNaN(size) ? size : 0,
      rows: !isNaN(size) ? size : 0,
    });
  };

  const handleGapChange = (text: string) => {
    setTempGap(text);
    const gap = parseInt(text);
    if (!isNaN(gap) && gap >= 0) {
      onConfigChange({ gap });
    }
  };

  const handleColorChange = (color: string) => {
    onConfigChange({ baseColor: color });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleChar, { color: "#FFB6C1" }]}>P</Text>
        <Text style={[styles.titleChar, { color: "#B6E3FF" }]}>a</Text>
        <Text style={[styles.titleChar, { color: "#B4F0A7" }]}>s</Text>
        <Text style={[styles.titleChar, { color: "#FFD1DC" }]}>t</Text>
        <Text style={[styles.titleChar, { color: "#DCD0FF" }]}>e</Text>
        <Text style={[styles.titleChar, { color: "#FFF4B6" }]}>l</Text>
        <Text style={[styles.titleChar, { color: "#FFB6C1" }]}> </Text>
        <Text style={[styles.titleChar, { color: "#B6E3FF" }]}>G</Text>
        <Text style={[styles.titleChar, { color: "#B4F0A7" }]}>r</Text>
        <Text style={[styles.titleChar, { color: "#FFD1DC" }]}>i</Text>
        <Text style={[styles.titleChar, { color: "#DCD0FF" }]}>d</Text>
      </View>
      <View style={styles.inputsContainer}>
        <View style={styles.column}>
          <Text style={styles.label}>Grid Size</Text>
          <TextInput
            style={styles.input}
            value={tempRow}
            onChangeText={handleSizeChange}
            keyboardType="numeric"
            placeholder="Enter a Grid Size"
            maxLength={2}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Grid Gap</Text>
          <TextInput
            style={styles.input}
            value={tempGap}
            onChangeText={handleGapChange}
            keyboardType="numeric"
            placeholder="Enter a Grid Gap"
            maxLength={2}
          />
        </View>
      </View>
      <Text style={styles.label}>Color Picker</Text>
      <ScrollView
        contentContainerStyle={styles.colorsContainer}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {COLOR_OPTIONS.map((color) => (
          <TouchableOpacity
            key={color.code}
            style={[
              styles.colorOption,
              {
                backgroundColor:
                  config.baseColor === color.code ? "white" : color.code,
              },
              config.baseColor === color.code && {
                ...styles.selectedColor,
                borderColor: color.code,
              },
            ]}
            onPress={() => handleColorChange(color.code)}
          >
            {config.baseColor === color.code ? (
              <Ionicons name="checkmark" size={16} color={color.code} />
            ) : (
              <Text style={styles.colorText}>{color.name}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  colorsContainer: {
    gap: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  titleChar: {
    fontSize: 32,
  },
  column: {
    alignItems: "center",
    marginBottom: 4,
    flex: 1,
  },
  inputsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    fontSize: 16,
    alignSelf: "stretch",
    paddingHorizontal: 12,
  },
  colorOption: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  selectedColor: {
    borderWidth: 2,
  },
  colorText: {
    textAlign: "center",
  },
});
