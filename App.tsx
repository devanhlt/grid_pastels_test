import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLOR_OPTIONS, ConfigPanel } from "./src/components/ConfigPanel";
import { useConfigGridState } from "./src/hooks/useGridState";
import DraggableGrid from "./src/components/DraggableGrid";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { GridConfig } from "./src/types";

// Only configure logger in non-test environment
if (process.env.NODE_ENV !== "test") {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
}

const DEFAULT_CONFIG: GridConfig = {
  columns: 3,
  rows: 3,
  gap: 10,
  baseColor: COLOR_OPTIONS[0],
};

export default function App() {
  const { reloadFlag, config, updateConfig, resetConfig } =
    useConfigGridState(DEFAULT_CONFIG);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <ConfigPanel config={config} onConfigChange={updateConfig} />
        <TouchableOpacity onPress={resetConfig} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <DraggableGrid
          columns={config.columns}
          rows={config.rows}
          baseColor={config.baseColor.code}
          gap={config.gap}
          forceReload={reloadFlag}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
    marginVertical: 16,
  },
  resetButton: {
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: "#4267B2",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignSelf: "center",
  },
  resetButtonText: {
    color: "#4267B2",
    fontWeight: "bold",
    fontSize: 16,
  },
});
