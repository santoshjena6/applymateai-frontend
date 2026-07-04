"use client";
import ErrorScreen from "@/components/errors/ErrorScreen";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ margin: 0 }}>
        <ErrorScreen 
          type="500" 
          title="Critical Error" 
          message="The app encountered an unrecoverable error. Please try again." 
          onRetry={reset} 
        />
      </body>
    </html>
  );
}
