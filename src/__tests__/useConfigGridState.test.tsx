import { renderHook, act } from "@testing-library/react-hooks";
import { useConfigGridState } from "../hooks/useGridState";
import { GridConfig } from "../types";
import { COLOR_OPTIONS } from "../components/ConfigPanel";

const DEFAULT_CONFIG: GridConfig = {
  columns: 3,
  rows: 3,
  gap: 10,
  baseColor: COLOR_OPTIONS[0],
};

describe("useConfigGridState", () => {
  it("should initialize with default config", () => {
    const { result } = renderHook(() => useConfigGridState(DEFAULT_CONFIG));

    expect(result.current.config).toEqual(DEFAULT_CONFIG);
    expect(result.current.reloadFlag).toBe(false);
  });

  it("should update config when updateConfig is called", () => {
    const { result } = renderHook(() => useConfigGridState(DEFAULT_CONFIG));

    act(() => {
      result.current.updateConfig({
        ...DEFAULT_CONFIG,
        columns: 4,
        rows: 4,
      });
    });

    expect(result.current.config.columns).toBe(4);
    expect(result.current.config.rows).toBe(4);
  });

  it("should reset config to default when resetConfig is called", () => {
    const { result } = renderHook(() => useConfigGridState(DEFAULT_CONFIG));

    // First update the config
    act(() => {
      result.current.updateConfig({
        ...DEFAULT_CONFIG,
        columns: 4,
        rows: 4,
      });
    });

    // Then reset it
    act(() => {
      result.current.resetConfig();
    });

    expect(result.current.config).toEqual(DEFAULT_CONFIG);
    expect(result.current.reloadFlag).toBe(true);
  });
});
