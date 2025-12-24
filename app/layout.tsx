import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Pramish Sihali | Full-Stack Developer",
  description: "Full-Stack Developer specializing in modern web technologies, AI integration, and creating elegant digital experiences.",
  keywords: ["Full-Stack Developer", "Web Developer", "React", "Next.js", "AI", "Portfolio"],
  authors: [{ name: "Pramish Sihali" }],
  creator: "Pramish Sihali",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Pramish Sihali | Full-Stack Developer",
    description: "Full-Stack Developer specializing in modern web technologies and AI integration.",
    siteName: "Pramish Sihali Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pramish Sihali | Full-Stack Developer",
    description: "Full-Stack Developer specializing in modern web technologies and AI integration.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexendDeca.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
