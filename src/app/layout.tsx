import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitnessPro - Assessoria Esportiva de Alta Performance",
  description: "Plataforma completa de assessoria esportiva com treinos personalizados, avaliação física profissional e acompanhamento em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
