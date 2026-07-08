import { ClerkProvider } from '@clerk/nextjs';
import { hasValidClerkPublishableKey } from '@/lib/clerk';
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Premium Startup Boilerplate",
  description: "Created using the ultimate interactive Next.js stack generator CLI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );

  if (!hasValidClerkPublishableKey()) {
    return body;
  }

  return (
    <ClerkProvider>
      {body}
    </ClerkProvider>
  );
}
