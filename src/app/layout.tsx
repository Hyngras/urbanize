import type { Metadata } from "next";
import "../styles/globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Urbanize | Gestão de Demandas Urbanas",
  description: "Plataforma para registro e acompanhamento de demandas urbanas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
