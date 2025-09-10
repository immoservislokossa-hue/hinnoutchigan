'use client';

import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${nunito.variable} font-sans antialiased bg-black text-white`}>
        <main className="min-h-screen flex flex-col justify-between">
          {/* Contenu principal */}
          <div className="flex-1">{children}</div>

          {/* Espace réservé pour ton logo organisateur */}
          <footer className="p-4 text-center text-white opacity-70">
            {/* 👉 Ici tu pourras ajouter <Image src="/logo.png" ... /> plus tard */}
          </footer>
        </main>
      </body>
    </html>
  );
}
