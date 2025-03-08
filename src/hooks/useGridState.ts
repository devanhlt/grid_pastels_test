import { useState } from 'react';
import { GridConfig } from '../types';

export const useGridState = (initialConfig: GridConfig) => {
    const [config, setConfig] = useState<GridConfig>(initialConfig);

    const updateConfig = (newConfig: Partial<GridConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    return {
        config,
        updateConfig,
    };
}; 