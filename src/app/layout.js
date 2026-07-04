import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

export const metadata = {
  title: "Joblenso | Find Your Dream Job with AI",
  description: "AI-powered job portal — scan your resume, match with top jobs, and track every application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Switzer — same as Homy's body font */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" />

        {/* Special Gothic — same as Homy's H1 font */}
        {/* Great Vibes — same as Homy's cursive italic accent word */}
        {/* Fragment Mono — Homy's mono font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Gothic&family=Great+Vibes&family=Fragment+Mono&display=swap" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
