import React from "react";
import { render } from "@testing-library/react-native";
import DraggableGrid from "../components/DraggableGrid";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useDerivedValue: jest.fn((callback) => ({ value: callback() })),
    useAnimatedReaction: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
  };
});

describe("DraggableGrid", () => {
  it("renders with default props", () => {
    const { getByTestId } = render(
      <DraggableGrid baseColor="#FF5252" forceReload={false} />
    );

    expect(getByTestId("draggable-grid-empty")).toBeTruthy();
  });

  it("renders with custom dimensions", () => {
    const { getByTestId } = render(
      <DraggableGrid
        columns={4}
        rows={4}
        gap={20}
        baseColor="#FF5252"
        forceReload={false}
      />
    );

    expect(getByTestId("draggable-grid")).toBeTruthy();
  });

  it("handles forceReload prop change", () => {
    const { rerender, getByTestId } = render(
      <DraggableGrid
        columns={4}
        rows={4}
        gap={20}
        baseColor="#FF5252"
        forceReload={false}
      />
    );

    expect(getByTestId("draggable-grid")).toBeTruthy();

    rerender(
      <DraggableGrid
        columns={4}
        rows={4}
        gap={20}
        baseColor="#FF5252"
        forceReload={true}
      />
    );
    expect(getByTestId("draggable-grid")).toBeTruthy();
  });
});
