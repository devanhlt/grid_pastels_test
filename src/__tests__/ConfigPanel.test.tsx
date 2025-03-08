import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ConfigPanel, COLOR_OPTIONS } from "../components/ConfigPanel";
import { GridConfig } from "../types";

const mockConfig: GridConfig = {
  columns: 3,
  rows: 3,
  gap: 10,
  baseColor: COLOR_OPTIONS[0],
};

describe("ConfigPanel", () => {
  it("renders with initial config", () => {
    const onConfigChange = jest.fn();
    const { getByTestId } = render(
      <ConfigPanel config={mockConfig} onConfigChange={onConfigChange} />
    );

    expect(getByTestId("config-panel")).toBeTruthy();
    expect(getByTestId("columns-input")).toBeTruthy();
    expect(getByTestId("gap-input")).toBeTruthy();
    expect(getByTestId("color-scroll")).toBeTruthy();
  });

  it("handles column input changes", () => {
    const onConfigChange = jest.fn();
    const { getByTestId } = render(
      <ConfigPanel config={mockConfig} onConfigChange={onConfigChange} />
    );

    const columnsInput = getByTestId("columns-input");
    fireEvent.changeText(columnsInput, "4");

    setTimeout(() => {
      expect(onConfigChange).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: 4,
        })
      );
    }, 300);
  });

  it("handles gap input changes", () => {
    const onConfigChange = jest.fn();
    const { getByTestId } = render(
      <ConfigPanel config={mockConfig} onConfigChange={onConfigChange} />
    );

    const gapInput = getByTestId("gap-input");
    fireEvent.changeText(gapInput, "20");

    setTimeout(() => {
      expect(onConfigChange).toHaveBeenCalledWith(
        expect.objectContaining({
          gap: 20,
        })
      );
    }, 300);
  });

  it("validates numeric inputs", () => {
    const onConfigChange = jest.fn();
    const { getByTestId } = render(
      <ConfigPanel config={mockConfig} onConfigChange={onConfigChange} />
    );

    const columnsInput = getByTestId("columns-input");
    fireEvent.changeText(columnsInput, "abc");

    expect(onConfigChange).not.toHaveBeenCalled();
  });
});
