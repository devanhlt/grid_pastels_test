import React, { useMemo, useEffect, useState, memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { generatePastelColors } from "../utils/colorUtils";
import { MatrixPosition, Position, Size } from "../types";
import { GridItem } from "./DraggableGridItem";
import { debounce } from "lodash";

interface GridProps {
  columns?: number;
  rows?: number;
  baseColor: string;
  gap?: number;
  forceReload: boolean;
}

const initializeMatrix = (
  columns: number,
  rows: number,
  baseColor: string
): MatrixPosition => {
  if (!columns || !rows) return [];

  const colors = generatePastelColors(baseColor, columns, rows);
  const matrix: MatrixPosition = [];

  let colorIndex = 0;
  for (let y = 0; y < rows; y++) {
    const row: Position[] = [];
    for (let x = 0; x < columns; x++) {
      row.push({
        px: x,
        py: y,
        color: colors[colorIndex++],
        id: `${x}:${y}`,
        key: `${x}_${y}_${baseColor}_${columns}_${rows}`,
      });
    }
    matrix.push(row);
  }

  return matrix;
};

const DraggableGrid: React.FC<GridProps> = memo(
  ({ columns, rows, baseColor, gap, forceReload }) => {
    const [size, setSize] = useState<Size | undefined>(undefined);
    const [flattenedPositions, setFlattenedPositions] = useState<
      Position[] | undefined
    >([]);

    const debounceSetSize = useCallback(
      debounce((size: Size) => {
        setSize(size);
      }, 100),
      []
    );

    const initialMatrix = useMemo(
      () => initializeMatrix(columns || 0, rows || 0, baseColor),
      [columns, rows, baseColor]
    );

    const positions = useSharedValue<MatrixPosition>(initialMatrix);

    useEffect(() => {
      positions.value = initializeMatrix(columns || 0, rows || 0, baseColor);
    }, [forceReload]);

    useEffect(() => {
      positions.value = initialMatrix;
    }, [initialMatrix]);

    useAnimatedReaction(
      () => positions.value,
      (positions) => {
        runOnJS(setFlattenedPositions)(positions.flat());
      }
    );

    if (!rows || !columns || rows <= 0 || columns <= 0) {
      return (
        <Text style={{ alignSelf: "center", margin: 24 }}>
          Grid Size must be greater than 0
        </Text>
      );
    }

    return (
      <View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          debounceSetSize({ width, height });
        }}
        style={styles.container}
      >
        {size &&
          flattenedPositions?.map((pos) => (
            <GridItem
              color={baseColor}
              key={`${pos.key}_${gap}`}
              positions={positions}
              id={pos.id}
              containerWidth={size?.width}
              containerHeight={size?.height}
              columns={columns}
              rows={rows}
              gap={gap || 0}
            />
          ))}
      </View>
    );
  },
  (prev, curr) => {
    return (
      curr.baseColor === prev.baseColor &&
      curr.columns === prev.columns &&
      curr.rows === prev.rows &&
      curr.gap === prev.gap &&
      prev.forceReload === curr.forceReload
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    borderRadius: 8,
    alignSelf: "stretch",
  },
});

export default DraggableGrid;
