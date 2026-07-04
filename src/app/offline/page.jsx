"use client";
import ErrorScreen from "@/components/errors/ErrorScreen";

export default function OfflinePage() {
  return (
    <ErrorScreen
      type="network"
      message="The Joblenso backend is not reachable. Make sure Spring Boot is running on port 8080 and try again."
      onRetry={() => window.location.reload()}
    />
  );
}
