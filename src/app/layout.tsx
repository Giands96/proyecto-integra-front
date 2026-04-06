import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Operadora Logística - RANSA",
  description: "RANSA es una empresa líder en el sector de la logística y el transporte, ofreciendo soluciones integrales para la gestión de la cadena de suministro. Con una amplia experiencia y presencia en América Latina, RANSA se dedica a brindar servicios de alta calidad que incluyen almacenamiento, distribución, transporte terrestre, marítimo y aéreo, así como servicios de valor agregado como embalaje y gestión de inventarios. La empresa se compromete a satisfacer las necesidades de sus clientes mediante la innovación tecnológica y un enfoque centrado en la eficiencia y la sostenibilidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
