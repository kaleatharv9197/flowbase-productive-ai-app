import { ClerkProvider } from '@clerk/nextjs';
import { hasValidClerkPublishableKey } from '@/lib/clerk';
import "./globals.css";
import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { CollaborationProvider } from "@/lib/collaboration-store";

export const metadata: Metadata = {
  title: "Nook & Canvas - Cozy Productivity",
  description: "A cozy Notion-Miro hybrid productivity app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <CollaborationProvider>
          <AppLayout>{children}</AppLayout>
        </CollaborationProvider>
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
