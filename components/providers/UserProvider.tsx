"use client";

import { getUserProfile } from "@/actions/getUserProfile";
import { updateUser } from "@/actions/updateUser";
import { useUserStore } from "@/lib/store/useUserStore";
import { IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: IUser | null;
  userLoading: boolean;
  updateUserHandler: (updatedUser: IUser) => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const { setUser } = useUserStore();

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      console.log("hello");
      const res = await getUserProfile();
      console.log("res provider", res);
      if (res) {
        setUser(res);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setUserLoading(false);
    }
  };

  const updateInterestInDB = async (updatedUser: IUser) => {
    try {
      await updateUser(updatedUser);
    } catch (err) {
      console.error("Error updating interest:", err);
    }
  };

  const updateUserHandler = (updatedUser: IUser) => {
    setUserState(updatedUser);
    updateInterestInDB(updatedUser);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, userLoading, updateUserHandler, refreshUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useInterest must be used within an InterestProvider");
  return context;
};
