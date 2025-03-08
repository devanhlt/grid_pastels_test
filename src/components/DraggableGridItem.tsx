import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  withSpring,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { MatrixPosition, Position } from "../types";
import { StyleSheet, Text } from "react-native";

type ItemProps = {
  positions: SharedValue<MatrixPosition>;
  id: string;
  containerWidth: number;
  containerHeight: number;
  columns: number;
  rows: number;
  gap: number;
};

type GestureContext = {
  startX: number;
  startY: number;
};

const rectOfCell = (
  px: number,
  py: number,
  itemWidth: number,
  itemHeight: number,
  gap: number
) => {
  "worklet";
  const left = (px + 1) * gap + px * itemWidth;
  const top = (py + 1) * gap + py * itemHeight;

  return { left, top, right: left + itemWidth, bottom: top + itemHeight };
};

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.max(min, Math.min(value, max));
};

const getMatrixPosition = (
  x: number,
  y: number,
  itemWidth: number,
  itemHeight: number,
  gap: number,
  columns: number,
  rows: number
) => {
  "worklet";
  const px = Math.floor(x / (itemWidth + gap));
  const py = Math.floor(y / (itemHeight + gap));
  return {
    px: clamp(px, 0, columns - 1),
    py: clamp(py, 0, rows - 1),
  };
};

const cell1IsBefore = (cell1: Position, cell2: Position) => {
  "worklet";
  return cell1.py < cell2.py || (cell1.py === cell2.py && cell1.px < cell2.px);
};

const cellIsTheSame = (cell1: Position, cell2: Position) => {
  "worklet";
  return cell1.px == cell2.px && cell1.py == cell2.py;
};

const isInRange = (point: Position, startCell: Position, endCell: Position) => {
  "worklet";
  return cell1IsBefore(point, endCell) && cell1IsBefore(startCell, point);
};

const moveCell = (
  matrix: Position[][],
  currentCell: Position,
  newPx: number,
  newPy: number,
  columns: number
) => {
  "worklet";
  const newMatrix = matrix.map((row) => [...row]);

  const targetCell = newMatrix[newPy][newPx];
  const cotMax = columns - 1;

  if (cell1IsBefore(currentCell, targetCell)) {
    for (let hang = currentCell.py; hang <= targetCell.py; hang++) {
      for (let cot = 0; cot < columns; cot++) {
        const point = newMatrix[hang][cot];
        if (
          isInRange(point, currentCell, targetCell) ||
          cellIsTheSame(point, targetCell)
        ) {
          const cotMoi = cot - 1;
          if (cotMoi < 0) {
            newMatrix[hang - 1][cotMax] = {
              ...point,
              px: cotMax,
              py: hang - 1,
            };
          } else {
            newMatrix[hang][cotMoi] = { ...point, px: cotMoi, py: hang };
          }
        }
      }
    }
  } else if (cell1IsBefore(targetCell, currentCell)) {
    for (let hang = currentCell.py; hang >= targetCell.py; hang--) {
      for (let cot = cotMax; cot >= 0; cot--) {
        const point = newMatrix[hang][cot];
        if (
          isInRange(point, targetCell, currentCell) ||
          cellIsTheSame(point, targetCell)
        ) {
          const cotMoi = cot + 1;
          if (cotMoi > cotMax) {
            newMatrix[hang + 1][0] = { ...point, px: 0, py: hang + 1 };
          } else {
            newMatrix[hang][cotMoi] = { ...point, px: cotMoi, py: hang };
          }
        }
      }
    }
  }

  newMatrix[newPy][newPx] = {
    ...currentCell,
    px: newPx,
    py: newPy,
  };

  return newMatrix;
};

export const GridItem: React.FC<ItemProps> = ({
  id,
  positions,
  containerWidth,
  containerHeight,
  columns,
  rows,
  gap,
}) => {
  const isMoving = useSharedValue(false);
  const currentX = useSharedValue(0);
  const currentY = useSharedValue(0);
  const itemWidth = useSharedValue(
    (containerWidth - (columns + 1) * gap) / columns
  );
  const itemHeight = useSharedValue(
    (containerHeight - (rows + 1) * gap) / rows
  );

  const position = useDerivedValue(() => {
    const arr = positions.value.flat();
    return arr.findLast((item) => item.id === id) || arr[0];
  });

  const left = useSharedValue(
    (position.value.px + 1) * gap + position.value.px * itemWidth.value
  );

  const top = useSharedValue(
    (position.value.py + 1) * gap + position.value.py * itemHeight.value
  );

  useEffect(() => {
    currentX.value = left.value;
    currentY.value = top.value;
  }, [left, top]);

  useAnimatedReaction(
    () => {
      return {
        px: position.value.px,
        py: position.value.py,
        gap,
        columns,
        rows,
      };
    },
    (current, previous) => {
      if (
        previous &&
        (current.px !== previous.px || current.py !== previous.py) &&
        !isMoving.value
      ) {
        currentX.value = withSpring(
          (current.px + 1) * current.gap + current.px * itemWidth.value,
          { damping: 15, stiffness: 120 }
        );
        currentY.value = withSpring(
          (current.py + 1) * current.gap + current.py * itemHeight.value,
          { damping: 15, stiffness: 120 }
        );
      }

      left.value =
        (position.value.px + 1) * current.gap +
        position.value.px * itemWidth.value;
      top.value =
        (position.value.py + 1) * current.gap +
        position.value.py * itemHeight.value;
      itemWidth.value =
        (containerWidth - (current.columns + 1) * current.gap) /
        current.columns;
      itemHeight.value =
        (containerHeight - (current.rows + 1) * current.gap) / current.rows;
    },
    [position, gap, itemWidth, itemHeight, columns, rows]
  );

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (_, ctx) => {
      "worklet";

      ctx.startX = currentX.value;
      ctx.startY = currentY.value;

      isMoving.value = true;
    },
    onActive: (event, ctx) => {
      "worklet";
      currentX.value = ctx.startX + event.translationX;
      currentY.value = ctx.startY + event.translationY;

      const { px, py } = getMatrixPosition(
        currentX.value,
        currentY.value,
        itemWidth.value,
        itemHeight.value,
        gap,
        columns,
        rows
      );

      if (px !== position.value.px || py !== position.value.py) {
        const res = moveCell(positions.value, position.value, px, py, columns);
        positions.value = res;
      }
    },
    onEnd: () => {
      "worklet";
      const { top, left } = rectOfCell(
        position.value.px,
        position.value.py,
        itemWidth.value,
        itemHeight.value,
        gap
      );

      currentX.value = left;

      currentY.value = top;

      isMoving.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: currentX.value,
      top: currentY.value,
      width: itemWidth.value,
      height: itemHeight.value,
      backgroundColor: position.value.color,
      position: "absolute",
      shadowColor: "#000",
      zIndex: isMoving.value ? 1 : 0,
      shadowOpacity: withSpring(isMoving.value ? 0.2 : 0),
      shadowRadius: 10,
    };
  }, [isMoving.value]);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text>{id}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    justifyContent: "center",
  },
});
