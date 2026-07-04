"use client";
import { useEffect } from "react";
import ErrorScreen from "@/components/errors/ErrorScreen";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  const isNetwork =
    error?.message?.toLowerCase().includes("network") ||
    error?.message?.toLowerCase().includes("fetch") ||
    error?.message?.toLowerCase().includes("econnrefused");

  const isAuth =
    error?.message?.toLowerCase().includes("401") ||
    error?.message?.toLowerCase().includes("unauthorized") ||
    error?.message?.toLowerCase().includes("session");

  const type = isAuth ? "session" : isNetwork ? "network" : "500";

  return <ErrorScreen type={type} onRetry={reset} />;
}
