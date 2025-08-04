"use client";

import { getUserData } from "@/actions/getInterest";
import { updateUser } from "@/actions/updateUser";
import { IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: IUser | null;
  userLoading: boolean;
  updateUserHandler: (updatedUser: IUser) => void;
  refreshUser: () => Promise<void>;
};

export const updateStreak = (user: IUser): IUser => {
  const formatDate = (date: Date) => date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const today = formatDate(new Date());
  const lastActive = user.lastActiveDate ?? null;

  // If no lastActiveDate (new user) → first activity today
  if (!lastActive) {
    return {
      ...user,
      streak: 1,
      lastActiveDate: today,
    };
  }

  // If user already active today → do nothing
  if (lastActive === today) return user;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let newStreak = 1;
  if (lastActive === yesterdayStr) {
    newStreak = user.streak + 1;
  }

  return {
    ...user,
    streak: newStreak,
    lastActiveDate: today,
  };
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const res = await getUserData();
      setUserState(res);
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
