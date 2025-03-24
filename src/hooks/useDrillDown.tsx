
import { useState, useCallback } from 'react';

interface DrillDownItem<T> {
  label: string;
  data: T[];
}

export function useDrillDown<T>(initialData: T[]) {
  const [drillStack, setDrillStack] = useState<DrillDownItem<T>[]>([{ label: 'Overview', data: initialData }]);
  const [currentLevel, setCurrentLevel] = useState(0);

  // Current data at this drill down level
  const currentData = drillStack[currentLevel]?.data || [];
  
  // Current label for the drill down level
  const currentLabel = drillStack[currentLevel]?.label || 'Overview';
  
  // Are we at the top level?
  const isTopLevel = currentLevel === 0;
  
  // Can we drill up?
  const canDrillUp = currentLevel > 0;

  // Drill down to a new level with the given data
  const drillDown = useCallback((label: string, data: T[]) => {
    setDrillStack(prev => [...prev.slice(0, currentLevel + 1), { label, data }]);
    setCurrentLevel(prev => prev + 1);
  }, [currentLevel]);

  // Go up one level
  const drillUp = useCallback(() => {
    if (currentLevel > 0) {
      setCurrentLevel(prev => prev - 1);
    }
  }, [currentLevel]);

  // Go back to the top level
  const resetDrill = useCallback(() => {
    setCurrentLevel(0);
  }, []);

  // Get the full drill path (breadcrumbs)
  const drillPath = drillStack.slice(0, currentLevel + 1).map(item => item.label);

  return {
    currentData,
    currentLabel,
    drillDown,
    drillUp,
    resetDrill,
    isTopLevel,
    canDrillUp,
    currentLevel,
    drillPath,
  };
}
