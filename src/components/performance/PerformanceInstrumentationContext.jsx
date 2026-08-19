import { createContext, useContext } from 'react';

const PerformanceInstrumentationContext = createContext(null);

export function PerformanceInstrumentationProvider({ value, children }) {
  return (
    <PerformanceInstrumentationContext.Provider value={value}>
      {children}
    </PerformanceInstrumentationContext.Provider>
  );
}

export function usePerformanceInstrumentation() {
  return useContext(PerformanceInstrumentationContext);
}
