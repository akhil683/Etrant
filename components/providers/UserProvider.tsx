// /context/InterestContext.tsx
"use client";

import { getUserData } from "@/actions/getInterest";
import { updateUser } from "@/actions/updateUser";
import { IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: IUser | null | undefined;
  setUserState: (user: IUser) => void;
  refreshInterest: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<IUser | null>();

  // Fetch from DB on load
  const fetchInterest = async () => {
    try {
      const res = await getUserData();
      setUserState(res);
    } catch (err) {
      console.error("Error fetching interest:", err);
    }
  };

  // Sync changes to DB
  const updateInterestInDB = async (updateduser: IUser) => {
    try {
      const res = await updateUser(updateduser);
    } catch (err) {
      console.error("Error updating interest:", err);
    }
  };

  // Update both state & DB
  const setInterest = (updatedUser: IUser) => {
    setUserState(updatedUser);
    updateInterestInDB(updatedUser);
  };

  useEffect(() => {
    fetchInterest();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUserState, refreshInterest: fetchInterest }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useInterest = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useInterest must be used within an InterestProvider");
  return context;
};
