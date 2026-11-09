import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "@/components/AppContext";

export const metadata: Metadata = {
  title: "Supertrapbros — Premium Selection",
  description: "Browse our exclusive catalog of top-shelf products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        <AppProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            richColors
            closeButton
          />
        </AppProvider>
      </body>
    </html>
  );
}

