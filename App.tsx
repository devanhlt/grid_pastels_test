import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ConfigPanel } from "./src/components/ConfigPanel";
import { useGridState } from "./src/hooks/useGridState";
import DraggableGrid from "./src/components/DraggableGrid";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function App() {
  const { config, updateConfig } = useGridState({
    columns: 5,
    rows: 5,
    gap: 10,
    baseColor: "#FF5252",
  });

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ConfigPanel config={config} onConfigChange={updateConfig} />
        <DraggableGrid
          columns={config.columns}
          rows={3}
          baseColor={config.baseColor}
          gap={config.gap}
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
    marginVertical: 20,
  },
});
