'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ActiveFlight {
  flightNumber: string;
  aircraft: string;
  from: string;
  to: string;
  fromDateTime: string;
  toDateTime: string;
  duration: number;
}

interface FlightContextValue {
  activeFlight: ActiveFlight | null;
  setActiveFlight: (flight: ActiveFlight | null) => void;
}

const FlightContext = createContext<FlightContextValue>({
  activeFlight: null,
  setActiveFlight: () => {},
});

export function FlightProvider({ children }: { children: ReactNode }) {
  const [activeFlight, setActiveFlight] = useState<ActiveFlight | null>(null);
  return (
    <FlightContext.Provider value={{ activeFlight, setActiveFlight }}>
      {children}
    </FlightContext.Provider>
  );
}

export function useFlight() {
  return useContext(FlightContext);
}
