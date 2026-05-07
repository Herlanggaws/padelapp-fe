import type { Metadata } from "next";
import "./globals.css";
import { SnackbarProvider } from "@/context/SnackbarContext";

export const metadata: Metadata = {
  title: "Padel App",
  description: "Book courts and join padel matches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-[#151C27] font-[Lexend,sans-serif]">
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
