import { useState } from 'react';
import { GridConfig } from '../types';

export const useConfigGridState = (initialConfig: GridConfig) => {
    const [config, setConfig] = useState<GridConfig>(initialConfig);
    const [reloadFlag, setReloadFlag] = useState(false);

    const updateConfig = (newConfig: Partial<GridConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };
    const resetConfig = () => {
        setConfig({ ...initialConfig });
        setReloadFlag(!reloadFlag)
    };

    return {
        reloadFlag,
        config,
        updateConfig,
        resetConfig
    };
}; 