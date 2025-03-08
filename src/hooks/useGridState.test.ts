import { renderHook, act } from '@testing-library/react-hooks';
import { useGridState } from './useGridState';
import { GridConfig } from '../types';

describe('useGridState', () => {
    const initialConfig: GridConfig = {
        size: 3,
        gap: 10,
        baseColor: '#FF5252',
    };

    it('should initialize with the correct config and items', () => {
        const { result } = renderHook(() => useGridState(initialConfig));

        expect(result.current.config).toEqual(initialConfig);
        expect(result.current.items).toHaveLength(9); // 3x3 grid
    });

    it('should update config correctly', () => {
        const { result } = renderHook(() => useGridState(initialConfig));

        act(() => {
            result.current.updateConfig({ size: 4 });
        });

        expect(result.current.config.size).toBe(4);
        expect(result.current.items).toHaveLength(16); // 4x4 grid
    });

    it('should handle item changes correctly', () => {
        const { result } = renderHook(() => useGridState(initialConfig));
        const newItems = [{ id: 'item-0', color: '#FF5252' }];

        act(() => {
            result.current.handleItemsChange(newItems);
        });

        expect(result.current.items).toEqual(newItems);
    });
}); 