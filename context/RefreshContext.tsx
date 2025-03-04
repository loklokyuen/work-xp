import { createContext, useState, useContext } from "react";

interface RefreshProviderProps {
  children: React.ReactNode;
}

interface RefreshContext {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const RefreshContext = createContext<RefreshContext | null>(null);

export function RefreshProvider({ children }: RefreshProviderProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <RefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefreshContext() {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefreshContext must be used within a RefreshProvider");
  }
  return context;
}
