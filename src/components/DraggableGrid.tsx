import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { generatePastelColors } from "../utils/colorUtils";
import { MatrixPosition, Position, Size } from "../types";
import { GridItem } from "./DraggableGridItem";

interface GridProps {
  columns: number;
  rows: number;
  baseColor: string;
  gap: number;
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
  for (let x = 0; x < rows; x++) {
    const row: Position[] = [];
    for (let y = 0; y < columns; y++) {
      row.push({
        px: x,
        py: y,
        color: colors[colorIndex++],
        id: `${x}:${y}`,
      });
    }
    matrix.push(row);
  }

  return matrix;
};

const DraggableGrid: React.FC<GridProps> = ({
  columns,
  rows,
  baseColor,
  gap,
}) => {
  const [size, setSize] = useState<Size | undefined>(undefined);

  const initialMatrix = useMemo(
    () => initializeMatrix(columns, rows, baseColor),
    [columns, rows, baseColor]
  );

  const positions = useSharedValue<MatrixPosition>(initialMatrix);

  useEffect(() => {
    positions.value = initialMatrix;
  }, [initialMatrix]);

  const flattenedPositions = useDerivedValue(() => {
    return positions.value.flat();
  });

  const style = useAnimatedStyle(
    () => ({
      padding: gap,
      width: size?.width,
      height: size?.height,
    }),
    [size, gap]
  );

  if (rows <= 0 || columns <= 0 || gap < 0) {
    return <></>;
  }

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        !size && setSize({ width, height });
      }}
      style={[styles.container, style]}
    >
      {size &&
        flattenedPositions.value.map((pos, index) => (
          <GridItem
            key={index}
            positions={positions}
            id={pos.id}
            containerWidth={size?.width}
            containerHeight={size?.height}
            columns={columns}
            rows={rows}
            gap={gap}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    position: "relative",
    alignSelf: "stretch",
  },
});

export default DraggableGrid;
