import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SnackbarProvider } from "@/context/SnackbarContext";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
