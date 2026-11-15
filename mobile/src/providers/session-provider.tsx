import * as SplashScreen from "expo-splash-screen";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SessionUser } from "@/api/auth";
import {
  loginWithGoogle,
  restoreSession,
  signOutSession,
} from "@/auth/session";

type SessionState = {
  user: SessionUser | null;
  isLoading: boolean;
  login: () => Promise<SessionUser>;
  signOut: () => Promise<void>;
  devSignIn: () => void;
  setUser: (user: SessionUser | null) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

const DEV_USER: SessionUser = {
  id: "dev-preview",
  name: "Dev Preview",
  email: "dev@etrant.local",
  image: null,
  plan: "Pro",
  subscriptionActive: true,
  points: 120,
  streak: 4,
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    restoreSession()
      .then((restored) => {
        if (!cancelled) setUser(restored);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
        SplashScreen.hideAsync().catch(() => undefined);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async () => {
    const session = await loginWithGoogle();
    setUser(session.user);
    return session.user;
  }, []);

  const signOut = useCallback(async () => {
    await signOutSession();
    setUser(null);
  }, []);

  const devSignIn = useCallback(() => {
    setUser(DEV_USER);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signOut,
      devSignIn,
      setUser,
      clearSession,
    }),
    [user, isLoading, login, signOut, devSignIn, clearSession],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside SessionProvider.");
  }
  return context;
}
