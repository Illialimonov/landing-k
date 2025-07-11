"use client";

import $api from "@/lib/http";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  tier: string;
  hasOneFreeConversion: boolean;
  subCredits?: number;
  login: (
    accessToken: string,
    refreshToken: string,
    email: string,
    tier: string,
    hasOneFreeConversion: boolean,
    subCredits?: number
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [tier, setTier] = useState("FREE");
  const [hasOneFreeConversion, setHasOneFreeConversion] = useState(false);
  const [subCredits, setSubCredits] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const syncAuthState = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.log(
          "[AuthProvider] No access token found, user not authenticated"
        );
        logout();
        return;
      }

      try {
        console.log("[AuthProvider] Fetching user data from /user/me");
        const res = await $api.get("/user/me");
        const { email, tier, hasOneFreeConversion, subCredits } = res.data;

        localStorage.setItem("userEmail", email);
        localStorage.setItem("tier", tier);
        localStorage.setItem(
          "hasOneFreeConversion",
          String(hasOneFreeConversion)
        );
        localStorage.setItem("subCredits", String(subCredits));

        setIsAuthenticated(true);
        setUserEmail(email);
        setTier(tier);
        setHasOneFreeConversion(hasOneFreeConversion);
        setSubCredits(subCredits);
      } catch (error: any) {
        console.error(
          "[AuthProvider] Error fetching user data:",
          error.response?.data || error.message
        );
        logout();
        router.push("/login");
      }
    };

    syncAuthState();
  }, []);

  const login = (
    accessToken: string,
    refreshToken: string,
    email: string,
    tier: string,
    hasOneFreeConversion: boolean,
    subCredits?: number
  ): Promise<void> => {
    return new Promise<void>((resolve) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("tier", tier);
      localStorage.setItem(
        "hasOneFreeConversion",
        String(hasOneFreeConversion)
      );

      if (subCredits !== undefined) {
        localStorage.setItem("subCredits", String(subCredits));
        setSubCredits(subCredits);
      }

      setIsAuthenticated(true);
      setUserEmail(email);
      setTier(tier);
      setHasOneFreeConversion(hasOneFreeConversion);

      resolve();
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("tier");
    localStorage.removeItem("hasOneFreeConversion");
    localStorage.removeItem("subCredits");

    setIsAuthenticated(false);
    setUserEmail("");
    setTier("FREE");
    setHasOneFreeConversion(false);
    setSubCredits(0);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        tier,
        hasOneFreeConversion,
        subCredits,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
