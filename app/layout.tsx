import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const archivo = Archivo({ subsets: ["latin"], variable: "--f-body" });

export const metadata: Metadata = {
  title: "TAYLOR'D WRAPS — the v1 era",
  description: "The Next.js foundation of the Taylor'd Wraps showcase. A wrap shop's website that transforms itself.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
      </head>
      <body className={`${anton.variable} ${archivo.variable}`}>{children}</body>
    </html>
  );
}
