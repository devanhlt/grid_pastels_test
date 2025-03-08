import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import App from "../../App";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe("App", () => {
  it("should render ConfigPanel", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("config-panel")).toBeTruthy();
  });

  it("should render DraggableGrid", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("draggable-grid")).toBeTruthy();
  });
});
