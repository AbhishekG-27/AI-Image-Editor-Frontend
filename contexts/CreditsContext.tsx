"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentSession } from "@/lib/actions/user.actions";

interface CreditsContextType {
  credits: number | null;
  updateCredits: (newCredits: number) => void;
  refreshCredits: () => Promise<void>;
  deductCredits: (amount: number) => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const deductCredits = (amount: number) => {
    setCredits((prev) => (prev ? Math.max(0, prev - amount) : 0));
  };

  const refreshCredits = async () => {
    try {
      const user = await getCurrentSession();
      if (user) {
        setCredits(user.credits);
      } else {
        setCredits(null);
      }
    } catch (error) {
      console.error("Error refreshing credits:", error);
    }
  };

  useEffect(() => {
    refreshCredits();
  }, []);

  return (
    <CreditsContext.Provider
      value={{ credits, updateCredits, refreshCredits, deductCredits }}
    >
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
