"use client";

import { useEffect, useState } from "react";

export default function DailyDigestPage() {
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("api/user");
      const user = await res.json();
    };
    fetchUser();
  }, []);
  return <div>Hello</div>;
}
